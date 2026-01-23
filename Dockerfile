FROM python:3.9-slim
RUN pip install flask requests docker redis
WORKDIR /app
COPY . .
CMD ["python", "app.py"]