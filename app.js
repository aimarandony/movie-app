$(document).ready(() => {
  console.info("Jquery is ready !!");

  var URL_LOCAL = "https://movieapidemov1.herokuapp.com";
//   var URL_LOCAL = "http://localhost:8080";
  var op = 0;

  function Listar() {
    $.get(`${URL_LOCAL}/api/movies`, (datos) => {
      let template = "";
      datos.forEach((elem) => {
        template += `
                            <tr class="text-center">
                                <td>${elem.id}</td>
                                <td>${elem.name}</td>
                                <td>${elem.price}</td>
                                <td>${elem.stock}</td>
                                <td>${elem.category.name}</td>
                                <td>${elem.quality.name}</td>
                                <td>
                                    <div class="btn-group">
                                        <button class="btn btn-warning btn-sm editar" id="${elem.id}" title="EDITAR">
                                            <i class="fas fa-pen"></i>
                                        </button>
                                        <button class="btn btn-info btn-sm info" id="${elem.id}" data-toggle="modal" data-target="#exampleModal" title="INFORMACIÓN">
                                            <i class="fas fa-info"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            `;
      });
      $("#tbody").html(template);
    });

    $.get(`${URL_LOCAL}/api/categories`, (datos) => {
      console.log(datos);
      let template = "";
      datos.forEach((elem) => {
        template += `
            <option value="${elem.id}">${elem.name}</option>
                                `;
      });
      $("#category").html(template);
    });

    $.get(`${URL_LOCAL}/api/qualities`, (datos) => {
      console.log(datos);
      let template = "";
      datos.forEach((elem) => {
        template += `
              <option value="${elem.id}">${elem.name}</option>
                                  `;
      });
      $("#quality").html(template);
    });
  }

  Listar();

  function Obtener() {
    var id = $("#id").val();
    var name = $("#name").val();
    var price = $("#price").val();
    var stock = $("#stock").val();
    var categoryid = $("#category").val();
    var qualityid = $("#quality").val();

    if (id === "") {
      op = 0;
    } else {
      op = 1;
    }

    const datos = {
      id,
      name,
      price,
      stock,
      category: {
        id: categoryid,
      },
      quality: {
        id: qualityid,
      },
    };
    return datos;
  }

  function Limpiar() {
    $("#id").val("");
    $("#name").val("");
    $("#price").val("");
    $("#stock").val("");
    $("#category").val(0);
    $("#quality").val(0);
  }

  $("#guardar").click(() => {
    const datos = Obtener();

    if (
      datos.name.trim() == "" ||
      datos.price.trim() == "" ||
      datos.stock.trim() == "" ||
      datos.price > 9999 ||
      datos.stock > 9999 ||
      datos.price < 1 ||
      datos.stock < 0
    ) {
      return;
    }

    console.log(datos);
    if (op == 0) {
      //insertar
      fetch(`${URL_LOCAL}/api/movies`, {
        method: "POST",
        body: JSON.stringify(datos),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((json) => {
          alertcustom(json.resp);
          Listar();
        });
    } else {
      //actualizar
      fetch(`${URL_LOCAL}/api/movies/${datos.id}`, {
        method: "PUT",
        body: JSON.stringify(datos),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((json) => {
          alertcustom(json.resp);
          Listar();
        });
    }
    Listar();
    Limpiar();
  });

  $(document).on("click", ".editar", function () {
    const id = $(this).attr("id");
    console.info("EDITAR (id):", id);

    fetch(`${URL_LOCAL}/api/movies/${id}`)
      .then((response) => response.json())
      .then((json) => {
        let data = json.movie;
        console.log(data);
        $("#id").val(data.id);
        $("#name").val(data.name);
        $("#price").val(data.price);
        $("#stock").val(data.stock);
        $("#category").val(data.category.id);
        $("#quality").val(data.quality.id);
      });
  });

  $(document).on("click", ".info", function () {
    const id = $(this).attr("id");
    fetch(`${URL_LOCAL}/api/movies/${id}`)
      .then((response) => response.json())
      .then((json) => {
        let data = json.movie;
        console.log(data);
        let template = `
        <ul class="list-group">
            <li class="list-group-item active">Película</li>
            <li class="list-group-item font-weight-bold">${data.name}</li>
            <li class="list-group-item active">Precio - Stock</li>
            <li class="list-group-item font-weight-bold">S/${data.price} - ${data.stock}</li>
            <li class="list-group-item active">Género</li>
            <li class="list-group-item font-weight-bold">${data.category.name}</li>
            <li class="list-group-item active">Calidad</li>
            <li class="list-group-item font-weight-bold">${data.quality.name}</li>
        </ul>
        <div class="form-row mt-3">
            <div class="form-group col-md-5">
                <label>Cantidad:</label>
                <input
                value="0"
                type="number"
                class="form-control"
                id="cantidad"
                onkeyup="opStock(event, ${data.price})"
                required
                min="0"
                />
            </div>
            <div class="form-group col-md-5">
                <label>Calidad:</label>
                <select id="quality2" class="form-control" onchange="opCalidad(event, ${data.price})" required>
                    <option value="HD">HD</option>
                    <option value="FULL HD">FULL HD</option>
                    <option value="ULTRA HD">ULTRA HD</option>
                    <option value="4k">4k</option>
                </select>
            </div>
            <div class="form-group col-md-2">
                <label class="font-weight-bold">Total:</label>
                <input
                type="number"
                class="form-control"
                id="total"
                readonly
                min="0"
                />
            </div>
        </div>
        `;
        $("#modal").html(template);
      });
  });

  function alertcustom(msg) {
    let template = `
    <div class="alert alert-dismissible alert-primary">
    <button type="button" class="close" data-dismiss="alert">&times;</button>
    ${msg}
    </div>
    `;
    $("#alert").html(template);
  }
});

function check(e) {
  tecla = document.all ? e.keyCode : e.which;
  if (tecla == 8) {
    return true;
  }
  patron = /[A-Za-z0-9]/;
  tecla_final = String.fromCharCode(tecla);
  return patron.test(tecla_final);
}

function opStock(e, price) {
  let stock = $("#cantidad").val();
  let quality = $("#quality2").val();
  $("#total").val(getPrecioTotal(price, quality, parseInt(stock)));
}

function opCalidad(e, price) {
  let stock = $("#cantidad").val();
  let quality = $("#quality2").val();
  $("#total").val(getPrecioTotal(price, quality, parseInt(stock)));
}

function getPrecioPorCalidad(price, quality) {
  var precio;
  switch (quality.toUpperCase()) {
    case "HD":
      return price;
      break;
    case "FULL HD":
      return price + 1;
      break;
    case "ULTRA HD":
      return price + 2;
      break;
    case "4K":
      return price + 3;
      break;
    default:
      return 0;
      break;
  }
  return price;
}

function getPrecioPorStock(price, stock) {
  return price * stock;
}

function getPrecioTotal(price, quality, stock) {
  let pxc = getPrecioPorCalidad(price, quality);
  return pxc * stock;
}
