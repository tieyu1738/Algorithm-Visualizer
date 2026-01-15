from flask import Flask, jsonify, request, send_from_directory, send_file
import sys, random, os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
app = Flask(__name__, static_folder='../frontend')
@app.route('/')
def index():
    return send_file('../frontend/index.html')
@app.route('/api/sort/bubble', methods=['POST'])
def bubble_sort():
    data = request.get_json() or {}
    size = min(max(data.get('size', 20), 5), 50)
    arr = list(range(1, size+1)); random.shuffle(arr)
    steps = []
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            steps.append({'array': arr.copy(), 'comparing': [j, j+1], 'swapped': False})
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
                steps.append({'array': arr.copy(), 'comparing': [j, j+1], 'swapped': True})
    return jsonify(steps)
@app.route('/api/pathfind/dijkstra', methods=['POST'])
def dijkstra():
    import heapq
    data = request.get_json() or {}
    rows, cols = 15, 15
    grid = [[0]*cols for _ in range(rows)]
    for i in range(rows):
        for j in range(cols):
            if random.random() < 0.3: grid[i][j] = 1
    grid[0][0]=0; grid[rows-1][cols-1]=0
    start,end=(0,0),(rows-1,cols-1)
    dist,prev,visited,steps = {start:0},{},set(),[]
    pq=[(0,start)]
    while pq:
        d,node = heapq.heappop(pq)
        if node in visited: continue
        visited.add(node); steps.append({'grid':[r[:] for r in grid],'visited':list(visited),'current':node,'path':[]})
        if node==end:
            path=[]; cur=end
            while cur in prev: path.append(cur); cur=prev[cur]
            path.append(start); path.reverse()
            steps.append({'grid':[r[:] for r in grid],'visited':list(visited),'current':node,'path':path})
            return jsonify(steps)
        for dx,dy in [(-1,0),(1,0),(0,-1),(0,1)]:
            nx,ny=node[0]+dx,node[1]+dy
            if 0<=nx<rows and 0<=ny<cols and grid[nx][ny]==0:
                nd=d+1
                if nd<dist.get((nx,ny),1e9):
                    dist[(nx,ny)]=nd; prev[(nx,ny)]=node; heapq.heappush(pq,(nd,(nx,ny)))
    return jsonify(steps)
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
