package api

import (
	"encoding/json"
	"log"
	"net/http"
	"stratus/internal/nike"
)

// NikeDrawRequest represents the draw entry API request
type NikeDrawRequest struct {
	Email      string `json:"email"`
	Password   string `json:"password"`
	ProductID  string `json:"product_id"`
	Size       string `json:"size"`
	PaymentID  string `json:"payment_id"`
}

// HandleEnterNikeDraw handles SNKRS draw entry
func HandleEnterNikeDraw(w http.ResponseWriter, r *http.Request) {
	var req NikeDrawRequest
	json.NewDecoder(r.Body).Decode(&req)

	// Login to Nike
	token, err := nike.Login(req.Email, req.Password)
	if err != nil {
		log.Println("❌ Nike login failed:", err)
		http.Error(w, "Nike login failed", http.StatusUnauthorized)
		return
	}

	// Enter the draw
	err = nike.EnterDraw(req.ProductID, req.Size, req.PaymentID, token)
	if err != nil {
		log.Println("❌ Failed to enter SNKRS draw:", err)
		http.Error(w, "Failed to enter SNKRS draw", http.StatusInternalServerError)
		return
	}

	log.Println("✅ Successfully entered SNKRS draw for product:", req.ProductID)
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Entry successful!"})
}
