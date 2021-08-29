<script>
export default {
  created () {
    localStorage.clear()
    this.$router.push('/')
  }
}
</script>
