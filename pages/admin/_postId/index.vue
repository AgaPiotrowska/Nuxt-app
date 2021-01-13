<template>
  <div class="admin-post-page">
    <section class="update-form">
      <AdminPostForm
      :post="loadedPost"
      />
    </section>
  </div>
</template>

<script>
  import AdminPostForm from '~/components/Admin/AdminPostForm.vue'

  export default {
    components: {
      AdminPostForm
    },
    layout: 'admin',
    data() {
      return {
      loadedPost: {
          author: 'Max',
          title: 'My awesome post',
          content: 'Amazing post, thanks for reading!',
          thumbnailLink: "https://static.pexels.com/photos/270348/pexels-photo-270348.jpeg"
      }
      }
    }
  }
</script>

<style scoped>
  .update-form {
    width: 90%;
    margin: 20px auto;
  }

  @media (min-width: 768px) {
    .update-form {
      width: 500px;
    }
  }
</style>
