package api

import (
	"encoding/json"
	"log"
	"net/http"
	"stratus/internal/nike/tasks"
)

// SNKRS Draw Request
type DrawEntryRequest struct {
	AccountID string `json:"account_id"`
	ProductID string `json:"product_id"`
	Size      string `json:"size"`
}

// HandleSNKRSDraw processes SNKRS draw entry requests
func HandleSNKRSDraw(w http.ResponseWriter, r *http.Request) {
	var req DrawEntryRequest
	json.NewDecoder(r.Body).Decode(&req)

	err := tasks.EnterDraw(req.AccountID, req.ProductID, req.Size)
	if err != nil {
		log.Println("❌ SNKRS draw entry failed:", err)
		http.Error(w, "Failed to enter SNKRS draw", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Draw entry successful"})
}
