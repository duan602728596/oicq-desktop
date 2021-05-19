const oicqWebSocketBtn = document.getElementById('oicqWebSocketBtn');

function handleWebSocketClick(event) {
  const ws = new WebSocket('ws://127.0.0.1:15890/oicq/ws');

  ws.addEventListener('open', function() {
    console.log('连接到服务。');
  }, false);

  ws.addEventListener('message', function(e) {
    console.log(JSON.parse(e.data));
  }, false);
}

oicqWebSocketBtn.addEventListener('click', handleWebSocketClick, false);