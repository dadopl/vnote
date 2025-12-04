FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    curl \
    pkg-config \
    gcc \
    g++ \
    libavformat-dev \
    libavcodec-dev \
    libavdevice-dev \
    libavutil-dev \
    libswscale-dev \
    libswresample-dev \
    libavfilter-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --no-cache-dir \
    requests \
    faster-whisper==1.0.3 \
    flask==3.0.0 \
    flask-cors==4.0.0 \
    gunicorn==21.2.0

# Copy application files
COPY server.py .

# Expose port
EXPOSE 9000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:9000/health || exit 1

# Run with gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:9000", "--workers", "1", "--timeout", "300", "server:app"]
