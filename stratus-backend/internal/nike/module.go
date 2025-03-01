package nike

import "sync"

var (
    moduleEnabled bool = true // Default enabled
    mu            sync.Mutex
)

// IsNikeModuleEnabled returns the status of the Nike module
func IsNikeModuleEnabled() bool {
    mu.Lock()
    defer mu.Unlock()
    return moduleEnabled
}

// SetNikeModuleEnabled updates the Nike module status
func SetNikeModuleEnabled(enabled bool) {
    mu.Lock()
    defer mu.Unlock()
    moduleEnabled = enabled
}
