<script>
  import { onMount } from 'svelte';
  import { flip } from 'svelte/animate';

  import api from '../public/api.json';

  const INITIAL_RECORDS = 'WEBPACK_BENCHMARK_INITIAL_RECORDS';

  let loading = false;
  let records = loadInitialRecords();
  let sortKey = '';
  let sortOrder = 1; // 1: positive order, -1: negatie order

  function loadInitialRecords() {
    try {
      records = JSON.parse(localStorage.getItem(INITIAL_RECORDS)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveInitialRecords() {
    try {
      localStorage.setItem(INITIAL_RECORDS, JSON.stringify(records));
    } catch (e) {
      // do nothing.
    }
  }

  async function fetchRecords() {
    if (records.length <= 0) {
      loading = true;
    }

    const res = await fetch(api.get);
    records = await res.json();
    records.forEach((record, index) => record.rank = index + 1);
    loading = false;

    saveInitialRecords();
  }

  function formatSize(value, initialUnit) {
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

  function formatTime(value) {
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

  function formatDate(value) {
    const bases = [60, 60, 24, 30, 365];
    const units = ['second', 'minute', 'hour', 'day', 'month', 'year']
    const date = new Date(value);
    const now = Date.now();
    let diff = parseInt((now - date) / 1000);
    let index = 0;
    let result = 'just now';

    while (diff && index < units.length) {
      result = `${diff} ${units[index]}${diff > 1 ? 's' : ''} ago`;
      diff = parseInt(diff / bases[index]);
      index++;
    }

    return result;
  }

  function formatRank(rank) {
    if (rank <= 3) {
      return ['🥇', '🥈', '🥉'][rank - 1];
    } else {
      return '#' + rank;
    }
  }

  function sortBy(key) {
    if (sortKey !== key) {
      sortOrder = 1;
    } else {
      sortOrder *= -1;
    }

    sortKey = key;

    records = records.sort((a, b) => {
      let valueA = a[key];
      let valueB = b[key];

      if (a[key] === b[key]) {
        valueA = a.id;
        valueB = b.id;
      }

      if (valueA < valueB) {
        return -1 * sortOrder;
      } else {
        return 1 * sortOrder;
      }
    });
  }

  onMount(async () => {
    await fetchRecords();
  });
</script>

<style>
  .title {
    text-align: center;
  }

  .billboard {
    margin: 20px auto;
  }

  .th {
    cursor: pointer;
  }

  .tr:nth-child(2n) {
    background-color: #efefef;
  }

  .tr:hover {
    background-color: #cfcfcf;
  }

  .td {
    padding: 10px;
  }
</style>

<main>
  <h1 class="title">Webpack benchmark!</h1>
  <table class="billboard">
    <thead>
      <th class="th" on:click="{() => sortBy('rank')}">Rank</th>
      <th class="th" on:click="{() => sortBy('username')}">User</th>
      <th class="th" on:click="{() => sortBy('platform')}">Platform</th>
      <th class="th" on:click="{() => sortBy('cpu')}">CPU</th>
      <th class="th" on:click="{() => sortBy('memory')}">Memory</th>
      <th class="th" on:click="{() => sortBy('projectName')}">Project name</th>
      <th class="th" on:click="{() => sortBy('bundleSize')}">Bundle size</th>
      <th class="th" on:click="{() => sortBy('compileTime')}">Compile time</th>
      <th class="th" on:click="{() => sortBy('compileSpeed')}">Compile Speed</th>
      <th class="th" on:click="{() => sortBy('uploadedAt')}">Update date</th>
    </thead>
    <tbody>
      {#each records as record, index (record.id)}
      <tr
        class="tr"
        animate:flip="{{ duration: 400 }}"
      >
        <td class="td">{formatRank(record.rank)}</td>
        <td class="td">{record.username}</td>
        <td class="td">{record.platform}</td>
        <td class="td">{record.cpu}</td>
        <td class="td">{formatSize(record.memory, 'M')}</td>
        <td class="td">{record.projectName}</td>
        <td class="td">{formatSize(record.bundleSize)}</td>
        <td class="td">{formatTime(record.compileTime)}</td>
        <td class="td">{formatSize(record.compileSpeed)}/s</td>
        <td class="td">{formatDate(record.uploadedAt)}</td>
      </tr>
    {/each}
    </tbody>
  </table>
</main>
