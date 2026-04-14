package com.conpedales.exception;

public class StripeCheckoutException extends RuntimeException {
    public StripeCheckoutException(String message) {
        super(message);
    }
}