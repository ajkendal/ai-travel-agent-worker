import OpenAI from 'openai';

// OPENAI_API_KEY
// GOOGLE_GEOCODING_API_KEY
// OPENWEATHER_API_KEY

// SENDING
// Number of Travelers
// Origin
// Destination
// Start Date
// End Date
// Budget - USD

// RETURNING
// Weather
// Flights
// Hotel
// Image
// Activity Suggestions

import { corsHeaders } from './headers';

const testData = {
	numberOfTravelers: 2,
	origin: 'New York',
	destination: 'Paris',
	startDate: '2025-09-28',
	endDate: '2025-10-01',
	budget: 5000,
};

const messages = [
	{
		role: 'system',
		content:
			'You are a travel assistant. The user will be passing information about their trip, including the number of travelers, origin, destination, start date, end date, and budget. We would like to return information about the weather, best flight, best hotel, one image from the location, and five activity suggestions.',
	},
];

export default {
	async fetch(request, env, ctx) {
		const openai = new OpenAI({
			apiKey: env.OPENAI_API_KEY,
			baseURL: 'https://gateway.ai.cloudflare.com/v1/e6ce664595e6c095158447cc6b80bc37/ai-travel-agent/openai',
		});

		async function getGeocoding(destination) {
			try {
				const response = await fetch(
					`http://api.openweathermap.org/geo/1.0/direct?q=${destination}&limit=5&appid=${env.OPENWEATHER_API_KEY}`
				);

				const geocoding = await response.json();
				return geocoding[0];
			} catch (error) {
				console.error('Error fetching geocoding:', error);

				return { lat: 0, lon: 0 };
			}
		}

		async function getWeather(location, startDate, endDate) {
			const vacationDays = [];

			const { lat, lon } = await getGeocoding(location);

			const start = new Date(startDate);
			const end = new Date(endDate);

			let currentDate = new Date(start);

			try {
				while (currentDate <= end) {
					const date = currentDate.toISOString().split('T')[0];
					const response = await fetch(
						`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&date=${date}&exclude=current,minutely,alerts,hourly&units=imperial&appid=${env.OPENWEATHER_API_KEY}`
					);

					const weatherData = await response.json();

					vacationDays.push({
						summary: weatherData.daily[0].summary,
						morning: weatherData.daily[0].temp.morn,
						day: weatherData.daily[0].temp.day,
						night: weatherData.daily[0].temp.night,
						weather: weatherData.daily[0].weather[0].description,
					});

					currentDate.setDate(currentDate.getDate() + 1);
				}

				return vacationDays;
			} catch (error) {
				console.error('Error fetching weather data:', error);
				vacationDays.push({
					summary: 'Unable to retrieve weather data',
					morning: 0,
					day: 0,
					night: 0,
					weather: 'Unknown',
				});
				return vacationDays;
			}
		}

		// const response = await openai.beta.chat.completions.runFunctions({
		// 	model: 'gpt-4.1-nano',
		// 	messages: messages,
		// 	functions,
		// });

		const weather = await getWeather(testData.destination, testData.startDate, testData.endDate);

		return new Response(JSON.stringify({ weather }), {
			headers: corsHeaders,
		});
	},
};
