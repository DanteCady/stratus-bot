package api

import (
    "encoding/json"
    "net/http"
    "stratus/internal/nike"
)

// NikeModuleStatus represents the response structure for module status
type NikeModuleStatus struct {
    Enabled bool `json:"enabled"`
}

// HandleNikeModule handles API requests to check or update Nike module status
func HandleNikeModule(w http.ResponseWriter, r *http.Request) {
    switch r.Method {
    case "GET":
        status := nike.IsNikeModuleEnabled()
        json.NewEncoder(w).Encode(NikeModuleStatus{Enabled: status})

    case "PUT":
        var req NikeModuleStatus
        if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
            http.Error(w, "Invalid request", http.StatusBadRequest)
            return
        }
        nike.SetNikeModuleEnabled(req.Enabled)
        w.WriteHeader(http.StatusOK)
        json.NewEncoder(w).Encode(NikeModuleStatus{Enabled: req.Enabled})

    default:
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
    }
}
