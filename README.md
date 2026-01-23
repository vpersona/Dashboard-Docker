# Docker System Pulse Dashboard

Interaktywny panel monitorowania zasobów systemowych zbudowany w architekturze mikroserwisów przy użyciu Docker Compose.

## Opis projektu
Projekt demonstruje zastosowanie konteneryzacji do budowy narzędzi monitorujących. System składa się z trzech współpracujących usług:
1.  **Monitor (Glances):** Kontener zbierający dane systemowe bezpośrednio z hosta, udustępnia je przez REST API v4.
2.  **Dashboard (Flask):** Aplikacja backendowa w Pythonie pobierająca dane z monitora, analizuje je i pokazuje interfejs użytkownika z wykresami w czasie rzeczywistym.
3. **Baza Danych (Redis):** Szybka baza danych typu in-memory, przechowująca historię pomiarów CPU.

## Technologie
* **Docker & Docker Compose** (Orkiestracja kontenerów)
* **Python 3.9 & Flask** (Backend API Proxy)
* **Chart.js** (Wizualizacja danych na frontendzie)
* **Glances API** (Źródło danych systemowych)
* **HTML5/CSS3** (Responsive Design)
* **Redis** (Baza Danych)

## Architektura i Funkcje
- **Microservices Communication:** Kontenery komunikują się wewnątrz sieci mostkowej (bridge) Dockera przy użyciu nazw usług.
- **Real-time Monitoring:** Wykresy liniowe odświeżane co 2 sekundy bez przeładowania strony (AJAX).
- **Alert System:** Automatyczna zmiana kolorystyki interfejsu na tryb alarmowy jeśli obciążenie CPU>80%.
- **Docker Integration:** Dashboard wyświetla listę aktywnych kontenerów dzięki dodaniu `docker.sock`.
- **Data Persistence:** Zastosowanie **Docker Volumes** do przechowywania logów aplikacji na systemie hosta.
- **Self-Healing:** Polityka `restart: always` zapewniająca odporność na awarie procesów.

## Zarządzanie Logami (Docker Volumes)
Projekt wykorzystuje wolumeny do zapewnienia trwałości danych (Data Persistence). 

- **Lokalizacja na hoście:** `./logs/app.log`
- **Lokalizacja w kontenerze:** `/app/logs/app.log`

Dzięki mapowaniu wolumenu w `docker-compose.yml`, wszystkie zdarzenia systemowe, błędy API oraz historię uruchomień można przeglądać bezpośrednio w systemie Windows, nawet gdy kontenery są zatrzymane. 

## Instrukcja uruchomienia

1.  Zainstaluj **Docker Desktop**.
2.  Pobierz pliki projektu do jednego folderu.
3.  Otwórz terminal w tym folderze i wpisz:
    ```bash
    docker-compose up --build
    ```
4.  Otwórz przeglądarkę i wejdź pod adres:
    `http://localhost:5000`

## Struktura plików
* `app.py` - Główna logika serwera Flask i komunikacja z API monitora.
* `docker-compose.yml` - Definicja usług, sieci, wolumenów i polityk restartu.
* `Dockerfile` - Instrukcja budowy obrazu dla dashboardu.
* `templates/index.html` - Frontend aplikacji (HTML/JS/Chart.js).
* `logs/` - Katalog (wolumen) z logami systemowymi.
* `static/app.js` - Wyodręobniony JavaScript
* `static/style.css` - Wyodrębione style dla index.html