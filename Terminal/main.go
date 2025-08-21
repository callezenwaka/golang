package main

import (
    "fmt"
    "net/http"
    "os/exec"
    "github.com/coder/websocket"
)

type Console struct{}

func (c *Console) wsHandler(w http.ResponseWriter, r *http.Request) {
    conn, err := websocket.Accept(w, r, &websocket.AcceptOptions{
        CompressionMode: websocket.CompressionDisabled,
    })
    if err != nil {
        http.Error(w, "Error accepting websocket: "+err.Error(), http.StatusInternalServerError)
        return
    }
    defer conn.Close(websocket.StatusNormalClosure, "Normal closure")

    cmd := exec.Command("bash")
    stdin, err := cmd.StdinPipe()
    if err != nil {
        http.Error(w, "Error creating stdin pipe: "+err.Error(), http.StatusInternalServerError)
        return
    }
    defer stdin.Close()

    stdout, err := cmd.StdoutPipe()
    if err != nil {
        http.Error(w, "Error creating stdout pipe: "+err.Error(), http.StatusInternalServerError)
        return
    }
    defer stdout.Close()

    if err := cmd.Start(); err != nil {
        http.Error(w, "Error starting command: "+err.Error(), http.StatusInternalServerError)
        return
    }

    go func() {
        buf := make([]byte, 1024)
        for {
            n, err := stdout.Read(buf)
            if err != nil {
                return
            }
            conn.Write(r.Context(), websocket.MessageText, buf[:n])
        }
    }()

    for {
        _, msg, err := conn.Read(r.Context())
        if err != nil {
            return
        }
        stdin.Write(msg)
    }
}

func main() {
    fmt.Println("Realtime online terminal server started on :8080")

    c := &Console{}

    // Handler for serving the HTML file
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        http.ServeFile(w, r, "index.html")
    })

    // Handler for WebSocket connections on a separate path
    http.HandleFunc("/ws", c.wsHandler)

    http.ListenAndServe(":8080", nil)
}