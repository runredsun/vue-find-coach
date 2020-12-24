export default {
    async registerCoach(context, payload) {
        const userID = context.rootGetters.userId
        const coachData = {
            id: context.rootGetters.userId,
            firstName: payload.first,
            lastName: payload.last,
            description: payload.desc,
            hourlyRate: payload.rate,
            areas: payload.areas
        };

        const token = context.rootGetters.token;
        const response = await fetch(`https://vue-find-coach-9df52-default-rtdb.firebaseio.com/coaches/${userID}.json?auth=${token}`, {
            method: 'PUT',
            body: JSON.stringify(coachData)

        })

        if (!response.ok) {
            //
        }
        console.log(response);
        context.commit('registerCoach', {
            ...coachData,
            id: userID
        });
    },
    async loadCoaches(context) {
        const response = await fetch(`https://vue-find-coach-9df52-default-rtdb.firebaseio.com/coaches.json`)
        const responseData = await response.json();

        if (!response.ok) {
            const error = new Error(responseData.message || 'Faild to fetch.')
            throw error;
        }

        const coaches = [];


        for (const key in responseData) {
            const coach = {
                id: key,
                firstName: responseData[key].firstName,
                lastName: responseData[key].lastName,
                description: responseData[key].description,
                hourlyRate: responseData[key].hourlyRate,
                areas: responseData[key].areas
            };
            coaches.push(coach);
        }

        context.commit('setCoaches', coaches);
    }
}