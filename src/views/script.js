document.getElementById('weather-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const city = document.getElementById('city').value;
    const resultDiv = document.getElementById('weather-result');
    resultDiv.innerHTML = '';

    try {
        const response = await fetch(`/api/weather/city?city=${city}`);
        if (response.ok) {
            const data = await response.json();
            resultDiv.innerHTML = `<p>Temperature at 14:00: ${data.temperature}°C</p>`;
        } else {
            resultDiv.innerHTML = `<p>Error: ${response.statusText}</p>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    }
});
