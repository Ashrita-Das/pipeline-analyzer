import {
    FiGitPullRequest,
} from 'react-icons/fi';
import { MdClear } from 'react-icons/md';
import { useStore } from '../store/store';
import { useShallow } from 'zustand/react/shallow';
import Alert from './alert';
import { useState } from 'react';
import toast from 'react-hot-toast';

// Zustand state selector to get nodes and edges
const selector = (state) => ({
    nodes: state.nodes,
    edges: state.edges,
    clearCanvas: state.clearCanvas,
});

export const SubmitButton = () => {
    const { nodes, edges, clearCanvas } = useStore(useShallow(selector));
    const [showAlert, setShowAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alertContent, setAlertContent] = useState({
        numNodes: 0,
        numEdges: 0,
        isDAG: false,
    });

    const handleSubmit = async () => {
        try {
            if (nodes.length === 0 || edges.length === 0) {
                toast.error('Cannot submit an empty pipeline! Please add nodes.');
                return;
            }
            setLoading(true);
            // Formatted pipeline data to be sent to backend
            const pipelineData = {
                nodes: nodes.map((node) => ({
                    id: node.id,
                    type: node.type,
                    data: node.data || {},
                    position: node.position || { x: 0, y: 0 },
                })),
                edges: edges.map((edge) => ({
                    id: edge.id,
                    source: edge.source,
                    target: edge.target,
                    sourceHandle: edge.sourceHandle || null,
                    targetHandle: edge.targetHandle || null,
                })),
            };

            // Send POST request to backend
            const response = await fetch(
                `${process.env.REACT_APP_API_SERVER_URL}/pipelines/parse`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(pipelineData),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Intentional delay
            await new Promise((resolve) => setTimeout(resolve, 600));

            toast.success('Pipeline submitted!');
            const result = await response.json();

            setAlertContent({
                numNodes: result.num_nodes,
                numEdges: result.num_edges,
                isDAG: result.is_dag ? 'Yes' : 'No',
            });
            setShowAlert(true);
        } catch (error) {
            console.error('Error submitting pipeline:', error);
            toast.error(`Error submitting pipeline: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        if (nodes.length === 0 && edges.length === 0) {
            toast.error('Canvas is already empty!');
            return;
        }

        const confirmClear = window.confirm(
            `Are you sure you want to clear the entire canvas?`
        );

        if (confirmClear) {
            clearCanvas();
        }
    };

    return (
        <div className='flex flex-col items-center'>
            <div className='flex gap-3'>
                <button
                    type='button'
                    onClick={handleClear}
                    className='flex items-center gap-1 bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold px-4 py-1 rounded-full shadow-lg hover:from-red-600 hover:to-red-800 transition-all duration-300'
                    title='Clear entire canvas'
                >
                    <MdClear className='text-xl' />
                    <span>Clear Canvas</span>
                </button>
                <button
                    type='button'
                    onClick={handleSubmit}
                    className='flex items-center gap-1 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold px-4 py-1 rounded-full shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300'
                >
                    <FiGitPullRequest className='text-xl' />
                    <span>Submit Pipeline</span>
                </button>
            </div>
            {loading ? (
                <Alert>
                    <img
                        width={64}
                        src='/loader.png'
                        className='absolute animate-spin top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
                        alt='Loading...'
                    ></img>
                </Alert>
            ) : (
                showAlert && (
                    <Alert>
                        <div className='bg-gray-100 p-6 rounded-xl shadow-2xl max-w-md w-full'>
                            <h1 className='text-2xl flex gap-1 items-center font-extrabold text-gray-800 mb-4 text-center'>
                                Pipeline Analysis Result
                            </h1>
                            <div className='space-y-2'>
                                <p className='text-lg text-gray-700'>
                                    <span className='font-semibold'>📌 Number of Nodes:</span>{' '}
                                    {alertContent.numNodes}
                                </p>
                                <p className='text-lg text-gray-700'>
                                    <span className='font-semibold'>📌 Number of Edges:</span>{' '}
                                    {alertContent.numEdges}
                                </p>
                                <p className='text-lg text-gray-700'>
                                    <span className='font-semibold'>📌 Is Valid DAG:</span>{' '}
                                    {alertContent.isDAG}
                                </p>
                            </div>
                            <div className='mt-4 flex justify-center'>
                                <button
                                    disabled={loading}
                                    className='bg-gradient-to-r from-red-500 to-red-700 text-white font-medium py-2 px-6 rounded-full shadow-md hover:from-red-600 hover:to-red-800 transition-all duration-300'
                                    onClick={() => setShowAlert(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </Alert>
                )
            )}
        </div>
    );
};