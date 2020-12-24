<template>
  <section>
    <base-card>
      <h2>Register as a Coach now!</h2>
      <coach-form @submit-form="registerCoach"></coach-form>
    </base-card>
  </section>
</template>

<script>
import coachForm from '../../components/coaches/CoachForm.vue';
export default {
  components: {
    coachForm,
  },
  methods: {
    registerCoach(formData) {
      this.$store.dispatch('coaches/registerCoach', formData);
      this.$router.replace('/coaches');
    },
  },
};
</script>

<style>
</style>