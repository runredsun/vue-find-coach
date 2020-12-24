export default {
    async contactCoach(context, payload) {
        const userID = context.rootGetters.userId
        const newRequest = {
            coachId: payload.coachId,
            userEmail: payload.email,
            userMessage: payload.message,
        }
        console.log(newRequest);
        const token = context.rootGetters.token;
        const response = await fetch(`https://vue-find-coach-9df52-default-rtdb.firebaseio.com/requests/${userID}.json?auth=${token}`, {
            method: 'POST',
            body: JSON.stringify(newRequest)

        })
        const responseData = await response.json();

        if (!response.ok) {
            const error = new Error(
                responseData.message || 'Failed to send request.'
            );
            throw error;
        }

        newRequest.id = responseData.name;
        newRequest.coachId = payload.coachId;

        context.commit('addRequest', newRequest);
    },
    async loadRequests(context) {
        const coachId = context.rootGetters.userId;
        const token = context.rootGetters.token;
        const response = await fetch(`https://vue-find-coach-9df52-default-rtdb.firebaseio.com/requests/${coachId}.json?auth=${token}`);
        const responseData = await response.json();
        if (!response.ok) {
            const error = new Error(
                responseData.message || 'Failed to fetch requests.'
            );
            throw error;
        }

        const requests = [];

        for (const key in responseData) {
            const request = {
                id: key,
                coachId: coachId,
                userEmail: responseData[key].userEmail,
                userMessage: responseData[key].userMessage
            };
            requests.push(request);
        }

        context.commit('setRequests', requests);
    }
}