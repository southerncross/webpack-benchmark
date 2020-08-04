<script>
  import { onMount } from 'svelte';
  import api from '../public/api.json';

  export let loading = false;
  export let records = [];

  async function fetchRecords() {
    if (loading) {
      return
    } else {
      loading = true
    }

    const res = await fetch(api.get);
    records = await res.json()
    loading = false
  }

  onMount(async () => {
    await fetchRecords()
  });

  export function formatSize(value, initialUnit) {
    const units = ' KMGTPEZYB';
    let index = Math.max(units.indexOf(initialUnit), 0);
    while (value >> 10) {
      value /= 1024;
      index++;
    }

    if (Number(value.toFixed(1)) !== Math.round(value)) {
      value = value.toFixed(1);
    } else {
      value = Math.round(value);
    }

    return value + units[index].trim() + 'B';
  }

  export function formatTime(value) {
    if (value < 1000) {
      return value + 'ms';
    } else {
      value = parseInt(value / 1000);
    }

    const units = 'smh';
    const smh = [0, 0, 0];
    let index = 0;
    while (value) {
      smh[index] = value % 60;
      value = parseInt(value / 60);
      index++;
    }

    let result = '';
    let hasValue = false;
    for (let i = 2; i >= 0; i--) {
      if (smh[i] > 0) {
        hasValue = true;
      }
      if (hasValue) {
        result += smh[i] + units[i];
      }
    }

    return result;
  }

  export function formatDate(value) {
    const date = new Date(value);
    return (
      date.getFullYear()
      + '-'
      + String(date.getMonth() + 1).padStart(2, '0')
      + '-'
      + String(date.getDate()).padStart(2, '0')
      + ' '
      + String(date.getHours()).padStart(2, '0')
      + ':'
      + String(date.getMinutes()).padStart(2, '0')
      + ':'
      + String(date.getSeconds()).padStart(2, '0')
    );
  }

  export function formatRank(value) {
    if (value <= 3) {
      return ['🥇', '🥈', '🥉'][value - 1];
    } else {
      return '#' + value;
    }
  }
</script>

<main>
  <h1>Webpack benchmark!</h1>
  <table>
    <thead>
      <th>Rank</th>
      <th>User</th>
      <th>Platform</th>
      <th>CPU</th>
      <th>Memory</th>
      <th>Project name</th>
      <th>Bundle size</th>
      <th>Time cost</th>
      <th>Speed</th>
      <th>Last uploaded date</th>
    </thead>
    <tbody>
      {#each records as record, index}
      <tr>
        <td>{formatRank(index + 1)}</td>
        <td>{record.username}</td>
        <td>{record.platform}</td>
        <td>{record.cpu}</td>
        <td>{formatSize(record.memory, 'M')}</td>
        <td>{record.projectName}</td>
        <td>{formatSize(record.bundleSize)}</td>
        <td>{formatTime(record.compileTime)}</td>
        <td>{formatSize(record.compileSpeed)}/s</td>
        <td>{formatDate(record.uploadedAt)}</td>
      </tr>
    {/each}
    </tbody>
  </table>
</main>
