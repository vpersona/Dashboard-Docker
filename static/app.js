  fetch('/api/info').then(res => res.json()).then(data => {
            document.getElementById('os-info').innerText = `${data.node} | ${data.os} ${data.release}`;
        });
 
 const ctx = document.getElementById('realtimeChart').getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [], 
                datasets: [
                    {
                        label: 'CPU %',
                        data: [],
                        borderColor: '#00dbde',
                        backgroundColor: 'rgba(0, 219, 222, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'RAM %',
                        data: [],
                        borderColor: '#ff007f',
                        backgroundColor: 'rgba(255, 0, 127, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true, 
                         grid: { color: '#333' } },
                    x: { grid: { display: false } }
                },
                plugins: { legend: { labels: { color: 'white' } } }
            }
        });

        function updateStats() {
            fetch('/api/stats')
                .then(response => response.json())
                .then(data => {
                    const now = new Date().toLocaleTimeString();
                    const cpu = data.cpu.total;
                    const ram = data.mem.percent;

                    document.getElementById('cpu-text').innerText = cpu + '%';
                    document.getElementById('ram-text').innerText = ram + '%';

                    chart.data.labels.push(now);
                    chart.data.datasets[0].data.push(cpu);
                    chart.data.datasets[1].data.push(ram);

                    if (cpu > 80) {
                            document.getElementById('cpu-text').style.color = 'red';
                            document.body.style.backgroundColor = '#2a0000'; 
                        } else {
                            document.getElementById('cpu-text').style.color = '#00dbde';
                            document.body.style.backgroundColor = '#121212';
                        }

                    if (chart.data.labels.length > 15) {
                        chart.data.labels.shift();
                        chart.data.datasets[0].data.shift();
                        chart.data.datasets[1].data.shift();
                    }

                    chart.update('none'); 
                })
                .catch(err => console.error("Błąd pobierania danych:", err));
        }



        function updateContainers() {
            fetch('/api/containers')
                .then(response => response.json())
                .then(data => {
                    const listElement = document.getElementById('container-list');
                    listElement.innerHTML = ''; 
                    
                    data.forEach(container => {
                        const card = document.createElement('div');
                        card.style.cssText = "background: #333; padding: 10px; border-radius: 5px; border-left: 4px solid " + (container.status === 'running' ? '#00ff00' : '#ff0000');
                        card.innerHTML = `<strong>${container.name}</strong><br>Status: ${container.status}`;
                        listElement.appendChild(card);
                    });
                });
        }
   


        updateContainers();
        setInterval(updateContainers, 5000);
        setInterval(updateStats, 2000);