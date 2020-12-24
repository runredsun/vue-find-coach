
<template>
  <div>
    <base-dialog
      :show="!!error"
      title="An error occurred!"
      @close="handleError"
    >
      <p>{{ error }}</p>
    </base-dialog>
    <section>
      <base-card>
        <header>
          <h2>Requests recieved</h2>
        </header>
        <base-spinner v-if="isLoading"></base-spinner>
        <ul v-if="hasRequests">
          <request-item
            v-for="item in recievedRequests"
            :key="item.id"
            :email="item.userEmail"
            :message="item.userMessage"
          ></request-item>
        </ul>
        <h3 v-else-if="!isLoading && !hasRequests">
          You haven't received any requests yet.
        </h3>
      </base-card>
    </section>
  </div>
</template>

<script>
import RequestItem from '../../components/requests/RequestItem.vue';
export default {
  components: {
    RequestItem,
  },
  data() {
    return {
      isLoading: false,
      error: null,
    };
  },
  computed: {
    recievedRequests() {
      return this.$store.getters['requests/requests'];
    },
    hasRequests() {
      return this.$store.getters['requests/hasRequests'];
    },
  },
  methods: {
    async loadRequests() {
      this.isLoading = true;
      try {
        await this.$store.dispatch('requests/loadRequests');
      } catch (e) {
        this.error = e.message || 'Something went wrong';
      }
      this.isLoading = false;
    },
    handleError() {
      this.error = null;
    },
  },
  created() {
    this.loadRequests();
  },
};
</script>

<style scoped>
header {
  text-align: center;
}

ul {
  list-style: none;
  margin: 2rem auto;
  padding: 0;
  max-width: 30rem;
}

h3 {
  text-align: center;
}
</style>