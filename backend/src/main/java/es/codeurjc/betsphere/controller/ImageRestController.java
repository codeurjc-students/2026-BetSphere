package es.codeurjc.betsphere.controller;

import java.io.IOException;
import java.security.Principal;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import es.codeurjc.betsphere.model.User;
import es.codeurjc.betsphere.service.ImageStorageService;
import es.codeurjc.betsphere.service.UserService;

@RestController
@RequestMapping("/api/v1/images")
public class ImageRestController {

    private final ImageStorageService imageStorageService;
    private final UserService userService;
    private final String bucket;

    public ImageRestController(ImageStorageService imageStorageService, UserService userService,
            @Value("${storage.s3.bucket}") String bucket) {
        this.imageStorageService = imageStorageService;
        this.userService = userService;
        this.bucket = bucket;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> upload(@RequestParam MultipartFile file, Principal principal) throws IOException {
        try {
            String key = imageStorageService.store(file);
            User user = userService.getByEmail(principal.getName());
            String previousKey = avatarKey(user.getAvatarUrl());
            user.setAvatarUrl("/api/v1/images/" + key);
            userService.save(user);
            if (previousKey != null && !previousKey.equals(key)) {
                imageStorageService.delete(previousKey);
            }
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("key", key, "url", user.getAvatarUrl()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{key}")
    public ResponseEntity<byte[]> get(@PathVariable String key) {
        try {
            if (!key.matches("[0-9a-fA-F-]{36}")) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Image not found.");
            }
            ImageStorageService.StoredImage image = imageStorageService.load(key);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(image.contentType()))
                    .cacheControl(CacheControl.noCache())
                    .body(image.bytes());
        } catch (software.amazon.awssdk.services.s3.model.NoSuchKeyException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Image not found.");
        }
    }

    @DeleteMapping("/{key}")
    public ResponseEntity<?> delete(@PathVariable String key, Principal principal) {
        User user = userService.getByEmail(principal.getName());
        if (!key.matches("[0-9a-fA-F-]{36}") || !user.getAvatarUrl().equals("/api/v1/images/" + key)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "You can only delete your own avatar."));
        }
        imageStorageService.delete(key);
        user.setAvatarUrl(null);
        userService.save(user);
        return ResponseEntity.noContent().build();
    }

    private String avatarKey(String avatarUrl) {
        if (avatarUrl == null || !avatarUrl.startsWith("/api/v1/images/")) {
            return null;
        }
        return avatarUrl.substring("/api/v1/images/".length());
    }
}
