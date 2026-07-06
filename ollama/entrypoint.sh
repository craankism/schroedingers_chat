#!/bin/bash
set -e

MODEL="${OLLAMA_MODEL:-qwen2.5-coder:7b}"

# Ollama im Hintergrund starten
ollama serve &
OLLAMA_PID=$!

# Warten bis Ollama bereit ist
echo "Warte auf Ollama..."
until curl -sf http://localhost:11434/api/tags >/dev/null 2>&1; do
    sleep 1
done

# Pruefen ob Modell schon vorhanden ist
echo "Pruefe Modell $MODEL..."
if ollama list | grep -q "$MODEL"; then
    echo "Modell $MODEL bereits vorhanden, kein Pull noetig."
else
    echo "Modell $MODEL nicht gefunden, starte Download..."
    ollama pull "$MODEL"
    echo "Download abgeschlossen."
fi

# Ollama in den Vordergrund holen, damit der Container nicht beendet wird
wait $OLLAMA_PID