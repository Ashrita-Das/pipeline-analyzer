import RootNode from './rootNode';
import NodeFields from './nodeFields';
import { nodeConfig } from '../config/nodeConfig';
import { useEffect, useRef, useState } from 'react';
import { useUpdateNodeInternals } from 'reactflow';

const AbstractNode = ({ id, data, type }) => {
    const config = nodeConfig[type];
    const updateNodeInternals = useUpdateNodeInternals();

    const [handles, setHandles] = useState(
        config?.handles || { inputs: [], outputs: [] }
    );

    // ✅ real refs (persist across renders)
    const prevHandlesRef = useRef(null);
    const updateRef = useRef(updateNodeInternals);

    // keep latest updateNodeInternals without triggering the main effect
    useEffect(() => {
        updateRef.current = updateNodeInternals;
    }, [updateNodeInternals]);

    // ✅ run ONLY when handles actually changes
    useEffect(() => {
        const prev = prevHandlesRef.current;
        const curr = handles;

        const same =
            prev &&
            prev.inputs?.length === curr.inputs?.length &&
            prev.outputs?.length === curr.outputs?.length &&
            prev.inputs.every((v, i) => v === curr.inputs[i]) &&
            prev.outputs.every((v, i) => v === curr.outputs[i]);

        if (same) return;

        updateRef.current(id);
        prevHandlesRef.current = curr;
    }, [id, handles]);

    if (!config) {
        return (
            <RootNode id={id} data={data} title='Unknown Node'>
                <div>Unknown node type: {type}</div>
            </RootNode>
        );
    }

    return (
        <RootNode
            id={id}
            data={data}
            type={type}
            title={config.title}
            handles={handles}
            nodeStyle={config.style}
        >
            <NodeFields
                nodeId={id}
                fields={config.fields}
                data={data}
                type={type}
                setHandles={setHandles}
            />
        </RootNode>
    );
};

export default AbstractNode;
