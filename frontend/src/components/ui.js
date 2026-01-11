import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from '../store/store';
import { shallow } from 'zustand/shallow';
import AbstractNode from '../nodes/abstractNode';
import { nodeConfig } from '../config/nodeConfig';
import 'reactflow/dist/style.css';

const gridSize = 15;
const proOptions = { hideAttribution: true };

// Building the nodes object from the different node types defined in the node config
const nodeTypes = Object.keys(nodeConfig).reduce((types, nodeType) => {
    types[nodeType] = (props) => <AbstractNode {...props} type={nodeType} />;
    return types;
}, {});

// Zustand state selector
const selector = (state) => ({
    nodes: state.nodes,
    edges: state.edges,
    getNodeID: state.getNodeID,
    addNode: state.addNode,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    onConnect: state.onConnect,
});

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const {
        nodes,
        edges,
        getNodeID,
        addNode,
        onNodesChange,
        onEdgesChange,
        onConnect,
    } = useStore(selector, shallow);

    const getInitNodeData = useCallback((nodeID, type) => {
        const config = nodeConfig[type];

        if (!config) {
            return { id: nodeID, nodeType: type };
        }

        const initialData = {
            id: nodeID,
            nodeType: type,
            ...config.fields.reduce((data, field) => {
                const defaultValue =
                    typeof field.defaultValue === 'function'
                        ? field.defaultValue(nodeID)
                        : field.defaultValue || '';
                data[field.name] = defaultValue;
                return data;
            }, {}),
        };

        return initialData;
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            if (event?.dataTransfer?.getData('application/reactflow')) {
                const appData = JSON.parse(
                    event.dataTransfer.getData('application/reactflow')
                );
                const type = appData?.nodeType;

                if (typeof type === 'undefined' || !type) {
                    return;
                }

                const position = reactFlowInstance.project({
                    x: event.clientX - reactFlowBounds.left,
                    y: event.clientY - reactFlowBounds.top,
                });

                const nodeID = getNodeID(type);
                const newNode = {
                    id: nodeID,
                    type,
                    position,
                    data: getInitNodeData(nodeID, type),
                };

                addNode(newNode);
            }
        },
        // eslint-disable-next-line
        [reactFlowInstance]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const isValidConnection = (connection) => {
        console.log('Attempting connection:', connection);
        return true;
    };

    return (
        <>
            <div
                ref={reactFlowWrapper}
                style={{ width: '100wv', height: 'calc(100vh - 157px)' }}
            >
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onInit={setReactFlowInstance}
                    nodeTypes={nodeTypes}
                    proOptions={proOptions}
                    snapGrid={[gridSize, gridSize]}
                    connectionLineType='smoothstep'
                    isValidConnection={isValidConnection}
                >
                    <Background color='#aaa' gap={gridSize} />
                    <Controls />
                    <MiniMap />
                </ReactFlow>
            </div>
        </>
    );
};