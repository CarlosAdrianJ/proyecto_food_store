package com.foodstore.backend.exception;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

public class ValidationErrorResponse extends ErrorResponse {

    private Map<String, String> errors = new LinkedHashMap<>();

    public ValidationErrorResponse() {
        super();
    }

    public ValidationErrorResponse(LocalDateTime timestamp, int status, String error, String message, String path) {
        super(timestamp, status, error, message, path);
    }

    public Map<String, String> getErrors() {
        return errors;
    }

    public void setErrors(Map<String, String> errors) {
        this.errors = errors;
    }

    public void addError(String field, String message) {
        this.errors.put(field, message);
    }
}