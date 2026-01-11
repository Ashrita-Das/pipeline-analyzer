from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define Types for request body
class PipelineData(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

# Function to Detect DAG or not using DFS based approach
def check_is_dag(nodes, edges):

    if not nodes or not edges:
        return True
    
    # Build adjacency list from edges
    graph = {}
    node_ids = set()
    
    for node in nodes:
        node_id = node.get('id', '')
        graph[node_id] = []
        node_ids.add(node_id)
    
    for edge in edges:
        source = edge.get('source', '')
        target = edge.get('target', '')
        if source in node_ids and target in node_ids:
            graph[source].append(target)
    
    
    ''' 
    WHITE (0): Unvisited node
    GRAY (1): Currently being processed (in the current DFS path)
    BLACK (2): Fully processed (all descendants visited) 
    '''
    WHITE, GRAY, BLACK = 0, 1, 2
    colors = {node_id: WHITE for node_id in node_ids}
    
    def has_cycle(node):
        # Back edge found - cycle detected
        if colors[node] == GRAY:  
            return True
        # Already processed
        if colors[node] == BLACK:  
            return False
        
        # Mark as being processed
        colors[node] = GRAY  
        
        # Check all neighbors
        for neighbor in graph[node]:
            if has_cycle(neighbor):
                return True
        
        # Mark as fully processed
        colors[node] = BLACK  
        return False
    
    # Check for cycles starting from any unvisited node
    for node_id in node_ids:
        if colors[node_id] == WHITE:
            if has_cycle(node_id):
                return False  
    
    return True 

# Routes     
@app.get("/")
def root():
    return {"message": "Welcome to the Pipeline Parser API"}

@app.post("/pipelines/parse")
def parse_pipeline(data: PipelineData):
  
    try:
        num_nodes = len(data.nodes)
        num_edges = len(data.edges)
        is_dag = check_is_dag(data.nodes, data.edges)
        
        return {
            "num_nodes": num_nodes,
            "num_edges": num_edges,
            "is_dag": is_dag
        }
        
    except Exception as e:
        return {
            "num_nodes": 0,
            "num_edges": 0,
            "is_dag": False,
            "error": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)