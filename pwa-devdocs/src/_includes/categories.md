{% assign categories = include.data.categories %}
{% if include.categories %}
{% assign categories = include.data.categories | where: "name", include.categories %}
{% endif %}

<table class="comparison-table">
  {% for categories in categories %}
  <tbody>
    <tr class="category-name">
      <th>{{ categories.name }}</th>
      <th>Support</th>
    </tr>
    {% for categoryFeature in categories.features %}
    <tr class="category-feature">
      <td>{{ categoryFeature.name }} <span class="support {{ categoryFeature.product }}"></span></td>
      <td>
        <span class="tooltip left" data-text="{{ categoryFeature.support }} support">
          <span class="support {{ categoryFeature.support }}"></span>
        </span>
      </td>
    </tr>
    {% endfor %}
  </tbody>
  {% endfor %}
</table>

<style>

/*** Tooltip ***/

.tooltip {
  position:relative;
}

.tooltip:before {
  content: attr(data-text);
  position:absolute;
  top:45%;
  transform:translateY(-50%);
  left:100%;
  margin-left:5px;
  width:120px;
  padding:5px;
  border-radius:3px;
  border:1px solid #ccc;
  background:#fefefe;
  color: #222;
  text-align:center;
  display:none;
  z-index:100;
}

.tooltip.left:before {
  left:initial;
  margin:initial;
  right:100%;
  margin-right:5px;
}

.tooltip:hover:before {
  display:block;
}

/*** Table ***/

.comparison-table {
  table-layout: fixed;
}

/*** Rows ***/

.category-feature {
  transition: all .2s;
  height: 26px;
}

.category-feature:hover {
  background: rgba(20,115,230,10%);
}

tbody tr.category-feature:last-child td {
  padding-bottom: 5px;
}

/*** Columns ***/

.category-name th {
  padding: 10px;
  font-size: 14px !important;
  font-weight: bold;
  color: black;
  background-color: #f1f1f1;
}

.category-name th:nth-child(1) {
   width: 100%;
}

.category-name th:nth-child(2) {
  width: 90px;
  text-align: center;
}

/*** Cells ***/

.category-feature td {
  padding: 7px 0px 0px 10px;
}

.category-feature td:nth-child(2) {
  text-align: center;
}

/*** Icons ***/

.support {
  height: 18px;
  font-size: 14px;
  font-weight: 400;
  padding: 5px 0;
}

.support.Commerce::before {
  display: inline-block;
  content: ' ';
  background-image: url('./images/commerce.svg');
  background-size: 14px 14px;
  height: 14px;
  width: 14px;
  margin-left: 5px;
  margin-bottom: -2px;
}

.support.Full::before {
  display: inline-block;
  content: ' ';
  background-image: url('./images/full.svg');
  background-size: 18px 18px;
  height: 18px;
  width: 18px;
}

.support.Partial::before {
  display: inline-block;
  content: ' ';
  background-image: url('./images/partial.svg');
  background-size: 18px 18px;
  height: 18px;
  width: 18px;
}

.support.Planned::before {
  display: inline-block;
  content: ' ';
  background-image: url('./images/planned.svg');
  background-size: 18px 18px;
  height: 18px;
  width: 18px;
}

.support.Custom::before {
  display: inline-block;
  content: ' ';
  background-image: url('./images/custom.svg');
  background-size: 18px 18px;
  height: 18px;
  width: 18px;
}

</style>