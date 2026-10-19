package es.codeurjc.betsphere.security.jwt;

public class AuthResponse {

    public enum Status {
        SUCCESS, FAILURE
    }

    private Status status;
    private String message;
    private String accessToken;

    public AuthResponse(Status status, String message) {
        this.status = status;
        this.message = message;
    }

    public AuthResponse(Status status, String message, String accessToken) {
        this.status = status;
        this.message = message;
        this.accessToken = accessToken;
    }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
}