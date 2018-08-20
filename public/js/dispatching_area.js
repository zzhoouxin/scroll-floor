/*
 *配送至地区通用Js
 */
$(function () {
  //是否自动初始加载
  var isAreaInitLoad = $("#isAreaInitLoad").val();
  isAreaInitLoad = $.trim(isAreaInitLoad);
  if (isAreaInitLoad == '' || isAreaInitLoad == '1') {
    loadAreaInit();
  }
  ctabs('locate_tabs', 'locate_wp', 'locate_list');
  ctabs('nav_tabs', 'product_detail', 'details_box');

  $(".close_area").click(function () {
    $(".choose_area").removeClass("choose_area_hover");
  });

  jQuery.fn.isChildAndSelfOf = function (b) { return (this.closest(b).length > 0); };
  $(document).click(function (event) {
    if (!$(event.target).isChildAndSelfOf(".choose_area")) {
      $(".choose_area").removeClass("choose_area_hover");
    };
  });
});

//根据会话获取区县加载
function loadAreaInit() {
  $.ajax({
    type: 'post',
    url: "../areaInit.htm",
    success: function (data) {
      if (data != null) {
        $(".province_text").attr("val", data.provinceId);
        $(".city_text").attr("val", data.cityId);
        $(".distinct_text").attr("val", data.districtId);
        $("#area_text").html(data.provinceName + data.cityName + data.districtName + "<b></b>");
      }
      doProvince();
    }
  });
}

//如果不想用自动加载方式，提供外部调用
function setAreaInit(provinceId, cityId, districtId, areaName) {
  $(".province_text").attr("val", $.trim(provinceId));
  $(".city_text").attr("val", $.trim(cityId));
  $(".distinct_text").attr("val", $.trim(districtId));
  $("#area_text").html($.trim(areaName) + "<b></b>");
  doProvince();
}

//省份处理
function doProvince() {
  var provinceObj = $(".province_text");
  var provId = provinceObj.attr("val");
  provId = $.trim(provId);

  //如果省份只初始加载1次
  var selPro = $(".province_list");
  if ($.trim(selPro.html()) == '') {
    $.ajax({
      type: 'post',
      url: "../getAllProvince.htm",
      async: false,
      success: function (data) {
        var provinceHtml = "";
        var provinceName = "";

        var def_prov_id = null;
        var def_prov_name = null;

        for (var i = 0; i < data.length; i++) {
          provinceHtml += "<li><a class='check_province' data-id='" + data[i].provinceId + "' onClick='setProvince(" + data[i].provinceId + ",\"" + data[i].provinceName + "\");' href='javascript:;'>" + data[i].provinceName + "</a></li>";
          if (provId != null && provId == data[i].provinceId) {
            provinceName = data[i].provinceName;
          }
          if (i == 0) {
            def_prov_name = data[i].provinceName;
            def_prov_id = data[i].provinceId;
          }
        }
        selPro.html(provinceHtml);

        if (provinceName == '') {
          provId = def_prov_id;
          provinceName = def_prov_name;
        }

        provinceObj.html(provinceName);
        provinceObj.attr("val", provId);
        doCity();
      }
    });
  } else {
    selPro.find(".check_province[data-id=" + provId + "]").click();
  }
}

function setProvince(provinceId, provinceName) {
  $(".province_text").attr("val", provinceId);
  $(".province_text").html(provinceName);
  doCity();
  $(".city_text").click();
}


//城市处理
function doCity() {
  var provinceObj = $(".province_text");
  var provId = provinceObj.attr("val");
  provId = $.trim(provId);

  var cityObj = $(".city_text");
  var cityId = cityObj.attr("val");
  cityId = $.trim(cityId);

  if (provId == null) {
    return;
  }
  $.ajax({
    type: 'post',
    url: "../getAllCityByPid.htm?provinceId=" + provId,
    async: false,
    success: function (data) {
      var cityHtml = "";
      var cityName = "";

      var def_city_id = null;
      var def_city_name = null;
      for (var i = 0; i < data.length; i++) {
        cityHtml += "<li><a class='check_city'  onClick='setCity(" + data[i].cityId + ",\"" + data[i].cityName + "\");' href='javascript:;'>" + data[i].cityName + "</a></li>";
        if (cityId != null && cityId == data[i].cityId) {
          cityName = data[i].cityName;
        }

        if (i == 0) {
          def_city_name = data[i].cityName;
          def_city_id = data[i].cityId;
        }
      }

      if (cityName == '') {
        cityId = def_city_id;
        cityName = def_city_name;
      }
      $(".city_list").html(cityHtml);
      cityObj.html(cityName);
      cityObj.attr("val", cityId);
      doDistinct();
    }
  });
}

function setCity(cityId, cityName) {
  $(".city_text").attr("val", cityId);
  $(".city_text").html(cityName);
  doDistinct();
  $(".distinct_text").click();
}

//区县处理
function doDistinct() {
  var cityObj = $(".city_text");
  var cityId = cityObj.attr("val");
  cityId = $.trim(cityId);

  var distinctObj = $(".distinct_text");
  var distinctId = distinctObj.attr("val");
  distinctId = $.trim(distinctId);

  if (cityId == null) {
    return;
  }
  $.ajax({
    type: 'post',
    url: "../getAllDistrictByCid.htm?cityId=" + cityId,
    async: false,
    success: function (data) {
      var distinctHtml = "";
      var distinctName = "";

      var def_distinct_id = null;
      var def_distinct_name = null;
      for (var i = 0; i < data.length; i++) {
        distinctHtml += "<li><a class='check_distinct'  onClick='checkDistinct(" + data[i].districtId + ",\"" + data[i].districtName + "\");' href='javascript:;'>" + data[i].districtName + "</a></li>";
        if (distinctId != null && distinctId == data[i].districtId) {
          distinctName = data[i].districtName;
        }

        if (i == 0) {
          def_distinct_name = data[i].districtName;
          def_distinct_id = data[i].districtId;
        }

        if (distinctName == '') {
          distinctId = def_distinct_id;
          distinctName = def_distinct_name;
        }
      }
      $(".distinct_list").html(distinctHtml);
      distinctObj.html(distinctName);
      distinctObj.attr("val", distinctId);
    }
  });
}


/*点击区县的时候*/
function checkDistinct(distinctId, districtName) {
  var distinctObj = $(".distinct_text");
  distinctObj.attr("val", distinctId);
  distinctObj.html(districtName);
  if (distinctId == null) {
    return;
  }
  $.ajax({
    type: 'post',
    url: "../setArea.htm?districtId=" + distinctId,
    async: false,
    success: function (data) {
      if (data != null) {
        $(".choose_area").removeClass("choose_area_hover");
        $("#area_text").html(data.provinceName + data.cityName + data.districtName + "<b></b>");
        var callback = distinctObj.attr("callback");
        callback = $.trim(callback);
        if (callback != '') {
          eval(callback);
        }
      }
    }
  });

}

//点击切换
function ctabs(t1, t2, t3) {
  $("." + t1).find("li:first").addClass("cur");
  $("." + t2).find("." + t3 + ":first").show().addClass("show");
  $("." + t1 + " li").each(function (n) {
    var current = $(this);
    $(this).find("a").click(function () {
      var cur = $(this);
      $("." + t1).find("li.cur").removeClass("cur");
      $("." + t2).find("." + t3 + ".show").hide().removeClass("show");
      current.addClass("cur");
      $("." + t2 + " ." + t3 + ":eq(" + n + ")").show().addClass("show");
    });
  });
};

//地区选择
jQuery.fn.isChildAndSelfOf = function (b) { return (this.closest(b).length > 0); };
$(".choose_area").mouseenter(function () {
  var cur = $(this);
  c_tm = setTimeout(function () {
    cur.addClass("choose_area_hover");
  }, 200);
});
