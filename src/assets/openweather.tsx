// async function getGeocoding(destination) {
// 	try {
// 		const response = await fetch(
// 			`http://api.openweathermap.org/geo/1.0/direct?q=${destination}&limit=5&appid=${env.OPENWEATHER_API_KEY}`
// 		);

// 		const geocoding = await response.json();
// 		return geocoding[0];
// 	} catch (error) {
// 		console.error('Error fetching geocoding:', error);
// 		return new Response(`Error: ${error.message}`, { status: 500, headers: corsHeaders });
// 		return { lat: 0, lon: 0 };
// 	}
// }

// async function getWeather({ location, startDate, endDate }) {
// 	const vacationDays = [];

// 	const { lat, lon } = await getGeocoding(location);

// 	const start = new Date(startDate);
// 	const end = new Date(endDate);

// 	let currentDate = new Date(start);

// 	try {
// 		while (currentDate <= end) {
// 			const date = currentDate.toISOString().split('T')[0];
// 			const response = await fetch(
// 				`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&date=${date}&exclude=current,minutely,alerts,hourly&units=imperial&appid=${env.OPENWEATHER_API_KEY}`
// 			);

// 			const weatherData = await response.json();

// 			vacationDays.push({
// 				date: date,
// 				summary: weatherData.daily[0].summary,
// 				morning: weatherData.daily[0].temp.morn,
// 				day: weatherData.daily[0].temp.day,
// 				night: weatherData.daily[0].temp.night,
// 				weather: weatherData.daily[0].weather[0].description,
// 			});

// 			currentDate.setDate(currentDate.getDate() + 1);
// 		}

// 		return vacationDays;
// 	} catch (error) {
// 		console.error('Error fetching weather data:', error);
// 		vacationDays.push({
// 			summary: 'Unable to retrieve weather data',
// 			morning: 0,
// 			day: 0,
// 			night: 0,
// 			weather: 'Unknown',
// 		});
// 		return new Response(`Error: ${error.message}`, { status: 500, headers: corsHeaders });
// 		return vacationDays;
// 	}
// }

// const tools = [
// 	{
// 		type: 'function',
// 		name: 'get_weather',
// 		description: 'Get the weather for the trip destination and dates',
// 		parameters: {
// 			type: 'object',
// 			properties: {
// 				location: { type: 'string', description: 'The city e.g. Paris' },
// 				startDate: { type: 'string', description: 'The start date of the trip YYYY-MM-DD' },
// 				endDate: { type: 'string', description: 'The end date of the trip YYYY-MM-DD' },
// 			},
// 			required: ['location', 'startDate', 'endDate'],
// 		},
// 	},
// ];
