package es.codeurjc.betsphere.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping({"/", "/matches", "/match/{id}", "/team/{id}", "/sport/{id}",
            "/competition/{id}", "/login", "/register", "/profile", "/history", "/admin"})
    public String index() {
        return "forward:/index.html";
    }
}
