import { Tooltip } from 'react-tooltip';
import { Handle, Position } from 'reactflow';
import { nodeConfig } from '../config/nodeConfig';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { useStore } from '../store/store';

const RootNode = ({
    id,
    data,
    type,
    title,
    children,
    handles = { inputs: [], outputs: [] },
    nodeStyle = {},
    titleStyle = {},
    className = '',
}) => {
    const Icon = nodeConfig[type]?.icon || null;
    const deleteNode = useStore((state) => state.deleteNode);

    const handleDelete = (e) => {
        e.stopPropagation();
        deleteNode(id);
    };

    const getHandlePosition = (index, total) => {
        if (total === 1) return '50%';
        return `${((index + 1) / (total + 1)) * 100}%`;
    };

    return (
        <div
            className={`${className} w-[220px] h-auto min-h-[80px] border border-black rounded-lg bg-white relative text-[12px]`}
            style={nodeStyle}
        >
            {/* Input Handles */}
            {handles.inputs.map((input, index) => (
                <div key={`input-${index}`}>
                    <Tooltip id={`handle-tooltip-${input}`} place='top' />
                    <Handle
                        type='target'
                        position={Position.Left}
                        id={`${id}_${input}`}
                        data-tooltip-id={`handle-tooltip-${input}`}
                        data-tooltip-content={input}
                        isConnectable={true}
                        style={{
                            top: getHandlePosition(index, handles.inputs.length),
                            width: '9px',
                            height: '9px',
                            borderRadius: '100%',
                            background: 'lightgray',
                            borderWidth: '2px',
                            borderColor: 'black',
                        }}
                    />
                </div>
            ))}

            {/* Node Content */}
            <div>
                <div className='flex items-center justify-between border-b p-2'>
                    <h3
                        style={titleStyle}
                        className='flex items-center gap-1 font-bold text-[15px]'
                    >
                        {Icon && <span>{Icon}</span>}
                        {title}
                    </h3>
                    <IoMdCloseCircleOutline
                        size={18}
                        className='hover:text-red-500 cursor-pointer transition-colors'
                        onClick={handleDelete}
                        title='Delete node'
                    />
                </div>
                <div className='p-2'>{children}</div>
            </div>

            {/* Output Handles */}
            {handles.outputs.map((output, index) => (
                <div key={`output-${index}`}>
                    <Tooltip id={`handle-tooltip-${output}`} place='top' />
                    <Handle
                        type='source'
                        position={Position.Right}
                        id={`${id}_${output}`}
                        data-tooltip-id={`handle-tooltip-${output}`}
                        data-tooltip-content={output}
                        isConnectable={true}
                        style={{
                            top: getHandlePosition(index, handles.outputs.length),
                            width: '9px',
                            height: '9px',
                            borderRadius: '100%',
                            background: 'lightgray',
                            borderWidth: '2px',
                            borderColor: 'black',
                        }}
                    />
                </div>
            ))}
        </div>
    );
};

export default RootNode;