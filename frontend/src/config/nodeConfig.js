import { TbApi } from 'react-icons/tb';
import { IoText } from 'react-icons/io5';
import { MdInput } from 'react-icons/md';
import { MdOutput } from 'react-icons/md';
import { LuBrainCircuit } from 'react-icons/lu';
import { FiCode } from 'react-icons/fi';

/* Note : To add new node types, simply add a new entry here in nodeConfig,
     it will automatically be picked up by the UI and toolbar */

export const nodeConfig = {
    customInput: {
        title: 'Input',
        handles: { inputs: [], outputs: ['value'] },
        style: { background: '#e8f5e8' },
        icon: <MdInput size={24} />,
        fields: [
            {
                name: 'inputName',
                type: 'text',
                label: 'Name',
                placeholder: 'Enter name for this node',
                defaultValue: (nodeId) => nodeId.replace('customInput_', 'input_'),
            },
            {
                name: 'inputType',
                type: 'select',
                label: 'Type',
                defaultValue: 'Text',
                options: ['Text', 'File', 'Image', 'Video', 'Audio'],
            },
        ],
    },

    llm: {
        title: 'LLM',
        handles: { inputs: ['system', 'prompt'], outputs: ['response'] },
        style: { background: '#ffe8cc' },
        icon: <LuBrainCircuit size={24} />,
        fields: [
            {
                name: 'llmName',
                type: 'text',
                label: 'Name',
                placeholder: 'Enter name for this node',
                defaultValue: (nodeId) => nodeId,
            },
            {
                name: 'llmSystem',
                type: 'textarea',
                label: 'System Instructions',
                placeholder: 'You are a helpful assistant.',
            },
            {
                name: 'llmPrompt',
                type: 'textarea',
                label: 'Prompt',
                placeholder: 'Type "{{" to use variables',
            },
        ],
    },

    customOutput: {
        title: 'Output',
        handles: { inputs: ['value'], outputs: [] },
        style: { background: '#ffe8e8' },
        icon: <MdOutput size={24} />,
        fields: [
            {
                name: 'outputName',
                type: 'text',
                label: 'Name',
                placeholder: 'Enter name for this node',
                defaultValue: (nodeId) => nodeId.replace('customOutput_', 'output_'),
            },
            {
                name: 'outputType',
                type: 'select',
                label: 'Type',
                defaultValue: 'Text',
                options: ['Text', 'Image'],
            },
        ],
    },

    text: {
        title: 'Text',
        handles: { inputs: [], outputs: ['output'] },
        style: { background: '#e8e8ff' },
        icon: <IoText size={24} />,
        fields: [
            {
                name: 'textName',
                type: 'text',
                label: 'Name',
                placeholder: 'Enter name for this node',
                defaultValue: (nodeId) => nodeId,
            },
            {
                name: 'text',
                type: 'textarea',
                label: 'Text',
                placeholder: 'Type "{{" to use variables',
                defaultValue: '',
            },
        ],
    },

    transform: {
        title: 'Transform',
        handles: { inputs: ['input'], outputs: ['output'] },
        style: { background: '#f8e8ff' },
        icon: <FiCode size={24} />,
        fields: [
            {
                name: 'textName',
                type: 'text',
                label: 'Name',
                placeholder: 'Enter name for this node',
                defaultValue: (nodeId) => nodeId,
            },
        ],
    },

    apiCall: {
        title: 'API Call',
        handles: { inputs: ['input'], outputs: ['response'] },
        style: { background: '#fff8dc', border: '1px solid #daa520' },
        icon: <TbApi size={24} />,
        fields: [
            {
                name: 'apiName',
                type: 'text',
                label: 'Name',
                placeholder: 'Enter name for this node',
                defaultValue: (nodeId) => nodeId,
            },
            {
                name: 'url',
                type: 'text',
                label: 'URL',
                placeholder: 'https://api.example.com/endpoint',
            },
            {
                name: 'method',
                type: 'select',
                label: 'Method',
                defaultValue: 'GET',
                options: ['GET', 'POST', 'PUT', 'DELETE'],
            },
            {
                name: 'headers',
                type: 'textarea',
                label: 'Headers (JSON)',
                placeholder: '{"key" : "value"}',
            },
            {
                name: 'body',
                type: 'textarea',
                label: 'Body (JSON / Plain text)',
                placeholder: '{"key" : "value"}',
            },
        ],
    },
};