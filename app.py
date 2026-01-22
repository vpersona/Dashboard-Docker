from flask import Flask, render_template, jsonify
import requests
import platform
import os
import logging


app = Flask(__name__)

if not os.path.exists('logs'):
    os.makedirs('logs')

logging.basicConfig(filename='logs/aspp.log', level=logging.INFO, 
                    format='%(asctime)s %(levelname)s: %(message)s')
#endpointy
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/info')
def info():
    return jsonify({
        "os": platform.system(),
        "node": platform.node(),
        "release": platform.release()
    })

@app.route('/api/container/<action>/<name>', methods=['POST'])
def container_action(action, name):
    try:
        container = client.containers.get(name)
        if action == 'restart':
            container.restart()
            logging.info(f"Zrestartowano kontener: {name}")
        elif action == 'stop':
            container.stop()
            logging.info(f"Zatrzymano kontener: {name}")
        return jsonify({"status": "success"})
    except Exception as e:
        logging.error(f"Błąd akcji {action} na {name}: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

#statystyki
@app.route('/api/stats')
def stats():
    try:
        cpu_data = requests.get("http://monitor:61208/api/4/cpu", timeout=1).json()
        mem_data = requests.get("http://monitor:61208/api/4/mem", timeout=1).json()
        
        cpu = cpu_data[0].get('total', 0) if isinstance(cpu_data, list) else cpu_data.get('total', 0)
        ram = mem_data[0].get('percent', 0) if isinstance(mem_data, list) else mem_data.get('percent', 0)
        
        return jsonify({"cpu": {"total": cpu}, "mem": {"percent": ram}})
    except Exception as e:
        logging.error(f"Blad stats: {e}")
        return jsonify({"cpu": {"total": "Err"}, "mem": {"percent": "Err"}})

# lista kontenerów
@app.route('/api/containers')
def containers():
    try:
        response = requests.get("http://monitor:61208/api/4/containers", timeout=1)
        data = response.json()
        
        formatted_list = []
        for c in data:
            formatted_list.append({
                "name": c.get('name', 'Unknown'),
                "status": c.get('status', 'unknown')
            })
        return jsonify(formatted_list)
    except Exception as e:
        logging.error(f"Blad containers: {e}")
        return jsonify([])

if __name__ == '__main__':
    logging.info("Serwer uruchomiony na porcie 5000")
    app.run(host='0.0.0.0', port=5000)