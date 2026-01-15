const canvas=document.getElementById('canvas'),ctx=canvas.getContext('2d');
const algoSelect=document.getElementById('algo'), playBtn=document.getElementById('play');
let steps=[], stepIdx=0, playing=false, animId=null;
async function loadAlgo(){
    const algo=algoSelect.value;
    const endpoint=algo==='bubble'?'/api/sort/bubble':'/api/pathfind/dijkstra';
    const body=algo==='bubble'?{size:20}:{rows:15,cols:15};
    const res=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    steps=await res.json(); stepIdx=0; renderStep();
}
function renderStep(){
    if(stepIdx>=steps.length){stopPlay();return}
    const s=steps[stepIdx]; ctx.clearRect(0,0,canvas.width,canvas.height);
    if(algoSelect.value==='bubble'){
        const arr=s.array, barW=canvas.width/arr.length, max=Math.max(...arr);
        for(let i=0;i<arr.length;i++){
            const h=(arr[i]/max)*(canvas.height*0.8);
            ctx.fillStyle=s.comparing?.includes(i)?'#FF9800':s.swapped?'#4CAF50':'#2196F3';
            ctx.fillRect(i*barW, canvas.height-h, barW-1, h);
        }
    }else{
        const grid=s.grid, cellW=canvas.width/grid[0].length, cellH=canvas.height/grid.length;
        for(let i=0;i<grid.length;i++) for(let j=0;j<grid[i].length;j++){
            ctx.fillStyle=grid[i][j]===1?'#000':s.path?.some(([x,y])=>x===i&&y===j)?'#4CAF50':
                     s.visited?.some(([x,y])=>x===i&&y===j)?'#FFC107':s.current&&s.current[0]===i&&s.current[1]===j?'#FF9800':'#FFF';
            ctx.fillRect(j*cellW,i*cellH,cellW,cellH); ctx.strokeStyle='#ddd'; ctx.strokeRect(j*cellW,i*cellH,cellW,cellH);
        }
    }
    stepIdx++;
}
function animate(){
    if(!playing) return;
    renderStep();
    const delay=1000-document.getElementById('speed').value*10;
    animId=setTimeout(animate,delay);
}
function stopPlay(){ playing=false; if(animId) clearTimeout(animId); playBtn.textContent='播放'; }
playBtn.onclick=()=>{playing=!playing; playBtn.textContent=playing?'暂停':'播放'; if(playing) animate(); else if(animId) clearTimeout(animId);};
document.getElementById('reset').onclick=()=>{stopPlay(); stepIdx=0; renderStep();};
document.getElementById('gen').onclick=loadAlgo;
algoSelect.onchange=loadAlgo;
loadAlgo();
