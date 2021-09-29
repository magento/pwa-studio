---
title: PWA Studio features
---

The following table shows the current and future PWA Studio features.

{% assign categories = include.data.categories %}
{% if include.categories %}
{% assign categories = include.data.categories | where: "name", include.categories %}
{% endif %}

<table class="comparison-table">
  {% for category in categories %}
  <tbody>
    <tr class="category-name">
      <th>{{ category.name }}</th>
      <th>Supported</th>
    </tr>
    {% for feature in categories.features %}
    <tr class="category-feature">
      <td>{{ feature.name }}</td>
      <td>
        <span class="status {{ feature.support }}"></span>
      </td>
    </tr>
    {% endfor %}
  </tbody>
  {% endfor %}
</table>

<style>
.comparison-table {
  table-layout: auto;
}

.category-feature {
  transition: all .2s;
}

.category-feature:hover {
  background: rgba(20,115,230,10%);
}

.comparison-table .category-name th {
  padding: 15px 15px;
  font-size: 14px !important;
  font-weight: bold;
  color: black;
  background-color: lightgray;
}

.status {
  height: 32px;
  font-size: 14px;
  font-weight: 400;
}

.status.full::before {
  display: inline-block;
  content: ' ';
  background-image: url('full.svg');
  background-size: 24px 24px;
  height: 24px;
  width: 24px;
}

.status.partial::before {
  display: inline-block;
  content: ' ';
  background-image: url('partial.svg');
  background-size: 24px 24px;
  height: 24px;
  width: 24px;
}

.status.planned::before {
  display: inline-block;
  content: ' ';
  background-image: url('planned.svg');
  background-size: 24px 24px;
  height: 24px;
  width: 24px;
}

.status.custom::before {
  display: inline-block;
  content: ' ';
  background-image: url('custom.svg');
  background-size: 24px 24px;
  height: 24px;
  width: 24px;
}

</style>