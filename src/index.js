import OpenAI from 'openai';
import { corsHeaders } from './headers';
// OPENAI_API_KEY
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
// Weather_icon
// Flights
// Flights_url
// Hotel
// Hotel_url
// Image
// Activities

const testData = {
	numberOfTravelers: 2,
	origin: 'New York, NY, USA',
	destination: 'Paris, France',
	startDate: '2025-09-28',
	endDate: '2025-10-01',
	budget: 5000,
};

let input = [
	{
		role: 'system',
		content: `You are a travel assistant. The user will be passing information about their trip, including the number of travelers, origin, destination, start date, end date, and budget. We would like to return information about the weather (if you can not get accurate weather data make an assumption for the typical weather of the location at that time), an icon associated with the weather from the icon_list, best flight with a link to the flights, best hotel with the link to the hotel, one image that represents the destination, and five activity suggestions with descriptions from the destination. response MUST formatted in JSON

		{
			weather: '',
			weather_icon: '',
			flights: '',
			flights_url: '',
			hotel: '',
			hotel_url: '',
			image: '',
			activities: [
			{
				name: '',
				description: '',
			}],
		}

		icon_list: SevereThunderstorms, Hail, BlowingSnow, Wind, Snow, Sleet, Blizzard, RainAndThunder, ScatteredThunderstorms, DrizzleNightTime, DrizzleDayTime, Drizzle, RainNightTime, RainDayTime, Rain, ScatteredShowersNightTime, ScatteredShowersDayTime, HeavyRain, Humidity, Fog, CloudyClearNightTime, PartlyCloudyNightTime, CloudyClearDayTime, PartlyCloudyClearDayTime, CloudyDayTime, Sunny, ClearNightTime
		`,
	},
];

export default {
	async fetch(request, env, ctx) {
		const openai = new OpenAI({
			apiKey: env.OPENAI_API_KEY,
			baseURL: 'https://gateway.ai.cloudflare.com/v1/e6ce664595e6c095158447cc6b80bc37/ai-travel-agent/openai',
		});

		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders });
		}

		input.push({
			role: 'user',
			content: `Here is the trip information: Number of Travelers: ${testData.numberOfTravelers}, Origin: ${testData.origin}, Destination: ${testData.destination}, Start Date: ${testData.startDate}, End Date: ${testData.endDate}, Budget - USD: ${testData.budget}`,
		});

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

		const tools = [
			{
				type: 'function',
				name: 'get_weather',
				description: 'Get the weather for the trip destination and dates',
				parameters: {
					type: 'object',
					properties: {
						location: { type: 'string', description: 'The city e.g. Paris' },
						startDate: { type: 'string', description: 'The start date of the trip YYYY-MM-DD' },
						endDate: { type: 'string', description: 'The end date of the trip YYYY-MM-DD' },
					},
					required: ['location', 'startDate', 'endDate'],
				},
			},
		];

		try {
			// let response = await openai.responses.create({
			// 	model: 'gpt-5',
			// 	tools,
			// 	input,
			// });

			// let functionCall = null;
			// let functionCallArguments = null;
			// input = input.concat(response.output);

			// response.output.forEach((item) => {
			// 	if (item.type == 'function_call') {
			// 		functionCall = item;
			// 		functionCallArguments = JSON.parse(item.arguments);
			// 	}
			// });
			// const result = {
			// 	weather: getWeather(functionCallArguments.location, functionCallArguments.startDate, functionCallArguments.endDate),
			// };

			// input.push({
			// 	type: 'function_call_output',
			// 	call_id: functionCall.call_id,
			// 	output: JSON.stringify(result),
			// });

			const response = await openai.responses.create({
				model: 'gpt-5',
				// tools,
				input,
			});

			const finalResponse = response.output[1].content[0].text;

			return new Response(JSON.stringify(finalResponse), {
				headers: corsHeaders,
			});
		} catch (error) {
			return new Response(`Error: ${error.message}`, { status: 500, headers: corsHeaders });
		}
	},
};
