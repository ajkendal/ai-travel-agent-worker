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

// const testData = {
// 	numberOfTravelers: 2,
// 	origin: 'New York, NY, USA',
// 	destination: 'Paris, France',
// 	startDate: '2025-09-28',
// 	endDate: '2025-10-01',
// 	budget: 5000,
// };

let input = [
	{
		role: 'system',
		content: `You are a travel assistant. The user will be passing information about their trip, including the number of travelers, origin, destination, start date, end date, and budget. We would like to return information about the weather (if you can not get accurate weather data make an assumption for the typical weather of the location at that time), an icon associated with the weather from the icon_list, best flight with a link to the flights, best hotel with the link to the hotel, and five activity suggestions with descriptions from the destination. response MUST formatted in JSON

		{
			weather: '',
			weather_icon: '',
			flights: '',
			flights_url: '',
			hotel: '',
			hotel_url: '',
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
		let returnObj = {
			weather: '',
			weather_icon: '',
			flights: '',
			flights_url: '',
			hotel: '',
			hotel_url: '',
			image: {
				url: '',
				revised_prompt: '',
			},
			activities: [
				{
					name: '',
					description: '',
				},
			],
		};

		const openai = new OpenAI({
			apiKey: env.OPENAI_API_KEY,
			baseURL: 'https://gateway.ai.cloudflare.com/v1/e6ce664595e6c095158447cc6b80bc37/ai-travel-agent/openai',
		});

		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders });
		}

		const data = await request.json();

		input.push({
			role: 'user',
			content: `Here is the trip information: Number of Travelers: ${data.numberOfTravelers}, Origin: ${data.origin}, Destination: ${data.destination}, Start Date: ${data.startDate}, End Date: ${data.endDate}, Budget - USD: ${data.budget}`,
		});

		const getImage = async (location, weather) => {
			const imageResponse = await openai.images.generate({
				model: 'dall-e-3',
				prompt: `A high-resolution natural Polaroid photograph of a famous landmark in ${location}, with ${weather} weather. The photo should capture the essence of the location and the atmosphere created by the weather conditions. The image should be detailed and inviting, showcasing the unique features of the landmark and the surrounding environment. No weather description text on the image`,
				size: '1024x1024',
			});
			return imageResponse.data[0];
		};

		try {
			const response = await openai.responses.create({
				model: 'gpt-5',
				input,
			});

			returnObj = JSON.parse(response.output[1].content[0].text);
			returnObj.image = await getImage(data.destination, returnObj.weather);

			return new Response(JSON.stringify(returnObj), {
				headers: corsHeaders,
			});
		} catch (error) {
			return new Response(`Error: ${error.message}`, { status: 500, headers: corsHeaders });
		}
	},
};
