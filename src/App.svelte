<script>
  import { onMount } from 'svelte'

  export let loading = false
  export let records = []

  const API_GET_BILLBOARD = 'https://service-6ta7w8ud-1300413308.bj.apigw.tencentcs.com/test/webpack-benchmark';

  async function fetchRecords() {
    if (loading) {
      return
    } else {
      loading = true
    }

    const res = await fetch(API_GET_BILLBOARD);
    records = await res.json()
    loading = false
  }

  onMount(async () => {
    await fetchRecords()
  });
</script>

<main>
  <h1>Webpack benchmark!</h1>
  <table>
    <thead>
      <th>User</th>
      <th>Platform</th>
      <th>CPU</th>
      <th>Memory (GB)</th>
      <th>Working Directory</th>
      <th>Bundle size (KB)</th>
      <th>Time cost (ms)</th>
      <th>Speed (KB/s)</th>
      <th>Last uploaded date</th>
    </thead>
    <tbody>
      {#each records as record}
      <tr>
        <td>{record.username}</td>
        <td>{record.platform}</td>
        <td>{record.cpu}</td>
        <td>{Number(record.memory / 1024).toFixed(1)}</td>
        <td>{record.projectName}</td>
        <td>{record.bundleSize}</td>
        <td>{record.compileTime}</td>
        <td>{record.compileSpeed}</td>
        <td>{new Date(record.uploadedAt).toLocaleString()}</td>
      </tr>
    {/each}
    </tbody>
  </table>
</main>
