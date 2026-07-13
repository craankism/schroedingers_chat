#!/bin/bash
set -e

CHAT_MODEL="${OLLAMA_MODEL:-qwen2.5-coder:3b}"
EMBEDDING_MODEL="${OLLAMA_EMBEDDING_MODEL:-nomic-embed-text:latest}"
READY_FILE="/tmp/ollama-ready"

rm -f "$READY_FILE"

# Ollama im Hintergrund starten
ollama serve &
OLLAMA_PID=$!

trap 'kill "$OLLAMA_PID"; wait "$OLLAMA_PID"' TERM INT

# Warten bis Ollama bereit ist
echo "Warte auf Ollama..."
until ollama list >/dev/null 2>&1; do
    sleep 1
done

# Pruefen ob Modell schon vorhanden ist
pull_if_missing() {
    MODEL_NAME="$1"

    echo "Pruefe Modell $MODEL_NAME..."
    if ollama show "$MODEL_NAME" >/dev/null 2>&1; then
        echo "Modell $MODEL_NAME bereits vorhanden, kein Pull noetig."
    else
        echo "Modell $MODEL_NAME nicht gefunden, starte Download..."
        ollama pull "$MODEL_NAME"
        echo "Download von $MODEL_NAME abgeschlossen."
    fi
}

pull_if_missing "$CHAT_MODEL"
pull_if_missing "$EMBEDDING_MODEL"

echo "Ollama ist bereit."
touch "$READY_FILE"

# Ollama in den Vordergrund holen, damit der Container nicht beendet wird
wait $OLLAMA_PID