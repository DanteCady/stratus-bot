package auth

import (
	"encoding/json"
	"log"
	"net/http"
)

// LoginHandler handles the Nike login request from the frontend
func LoginHandler(w http.ResponseWriter, r *http.Request) {
	// Only allow POST requests
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	// Decode request body
	var loginRequest NikeLoginRequest
	if err := json.NewDecoder(r.Body).Decode(&loginRequest); err != nil {
		log.Println("❌ Invalid JSON in login request:", err)
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	// Call Nike login function
	loginResponse, err := HandleNikeLogin(loginRequest.Email, loginRequest.Password)
	if err != nil {
		http.Error(w, "Login failed", http.StatusUnauthorized)
		return
	}

	// Send response back to the frontend
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(loginResponse)
}
