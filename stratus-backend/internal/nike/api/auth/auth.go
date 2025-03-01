package auth

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"stratus/internal/nike"
)

// NikeLoginRequest represents the login request payload
type NikeLoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// NikeLoginResponse represents the login response from Nike
type NikeLoginResponse struct {
	AccessToken string `json:"access_token"`
	TokenType   string `json:"token_type"`
	ExpiresIn   int    `json:"expires_in"`
	RefreshToken string `json:"refresh_token"`
}

// HandleNikeLogin handles login requests to Nike
func HandleNikeLogin(email, password string) (*NikeLoginResponse, error) {
	loginURL := "https://api.nike.com/idn/shim/session" // Nike's login endpoint

	// Create request payload
	payload := NikeLoginRequest{
		Email:    email,
		Password: password,
	}

	// Convert payload to JSON
	jsonData, err := json.Marshal(payload)
	if err != nil {
		log.Println("❌ Error marshalling login data:", err)
		return nil, err
	}

	// Make HTTP request
	req, err := http.NewRequest("POST", loginURL, bytes.NewBuffer(jsonData))
	if err != nil {
		log.Println("❌ Error creating login request:", err)
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("User-Agent", "StratusBot/1.0") // Custom User-Agent

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Println("❌ Error sending request to Nike:", err)
		return nil, err
	}
	defer resp.Body.Close()

	// Read response
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Println("❌ Error reading Nike response:", err)
		return nil, err
	}

	// Handle errors
	if resp.StatusCode != http.StatusOK {
		log.Printf("❌ Nike login failed. Status: %d, Response: %s\n", resp.StatusCode, body)
		return nil, errors.New("Nike login failed")
	}

	// Parse response
	var loginResponse NikeLoginResponse
	if err := json.Unmarshal(body, &loginResponse); err != nil {
		log.Println("❌ Error parsing Nike login response:", err)
		return nil, err
	}

	log.Println("✅ Nike Login Successful. Access Token:", loginResponse.AccessToken)
	return &
