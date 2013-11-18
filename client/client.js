Meteor.subscribe('markers');

var Markers = new Meteor.Collection('markers');

window.resize = function(t) {
  var c, h, m, top, w;
  w = window.innerWidth;
  h = window.innerHeight;
  top = t.find('#map').offsetTop;
  c = w - 40;
  m = (h - top) - 65;
  t.find('#container').style.width = "" + c + "px";
  return t.find('#map').style.height = "" + m + "px";
};


  Template.main.rendered = function () {
    
    console.log( " rendered " );
    
    var query,_this = this;
    window.resize(this);
    $(window).resize(function() 
    {
      return window.resize(_this);
    });
    L.Icon.Default.imagePath = 'packages/leaflet/images';
    
    window.map = L.map('map', { doubleClickZoom: false } ).setView([43.229664, 5.444571], 12);

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                     '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        maxZoom: 18
    }).addTo(map);

    var MapIcon = L.Icon.extend({
        options: {
            shadowUrl: 'img/map/marker-shadow.png'
        }     
    });

    var icon = new MapIcon({iconUrl: 'img/map/marker-icon.png'});
    
    window.map.on('dblclick', function(e) {
      
      console.log('new marker :' + e.latlng );
      return Markers.insert({
        latlng: e.latlng
      });
    });
        
   var marker = L.marker([43.229664, 5.444571], {icon: icon});
   marker.bindPopup('<strong>' + 'titii' + '</strong><br />' + 'sdfsfs');
   marker.addTo(map);
    
   
    var circle = L.circle([43.229664, 5.444571], 500, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5
    }).addTo(map);
    
    
    query = Markers.find({});
  
  return query.observe({
    added: function(mark) {
      var marker;
      return marker = L.marker(mark.latlng).addTo(window.map).on('click', function(e) {
        var mymarker = Markers.findOne({latlng: this._latlng});
        console.log('mymarker : ' + mymarker.latlng );
        return Markers.remove({
          _id: mymarker._id
        });
      });
    },
    removed: function(mark) {
      var key, layers, val, _results;
      layers = window.map._layers;
      _results = [];
      for (key in layers) {
        val = layers[key];
        if (!val._latlng) {

        } else {
          if (val._latlng.lat === mark.latlng.lat && val._latlng.lng === mark.latlng.lng) {
            _results.push(window.map.removeLayer(val));
          } else {
            _results.push(void 0);
          }
        }
      }
      return _results;
    }
  });
    
    
}; 
