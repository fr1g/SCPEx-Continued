import { useState, useRef } from 'react';
import Paper from '../../components/Fragments/Paper';
import Button from '../../components/Fragments/Button';
import Icon from '../../components/Fragments/Icon';

export default function Base64Helper() {
    const [dataUrl, setDataUrl] = useState('');
    const [preview, setPreview] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const handleFileUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                const result = e.target.result as string;
                setDataUrl(result);
                setPreview(result);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleTextChange = (value: string) => {
        setDataUrl(value);
        try {
            if (value.startsWith('data:image')) {
                setPreview(value);
            } else {
                setPreview('');
            }
        } catch {
            setPreview('');
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file?.type.startsWith('image/')) {
            handleFileUpload(file);
        }
    };

    return (
        <Paper>
            <div className="max-w-2xl mx-auto p-4">
                {/* 文件上传区域 */}
                <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 text-center cursor-pointer"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            file && handleFileUpload(file);
                        }}
                    />
                    <p className="text-gray-500">
                        Drag in or click to upload an image.
                    </p>
                </div>

                {/* 图片预览 */}
                {preview && (
                    <div className="mb-4">
                        <img
                            src={preview}
                            alt="Preview"
                            className="max-h-64 mx-auto object-contain"
                        />
                    </div>
                )}

                {/* 数据编辑区域 */}
                <textarea
                    ref={textAreaRef}
                    value={dataUrl}
                    onChange={(e) => handleTextChange(e.target.value)}
                    placeholder="Here for Base64 data URL..."
                    className="w-full h-48 p-3 border rounded-md font-mono text-sm resize-none"
                />

                {/* 操作按钮 */}
                <div className="mt-4 flex gap-2">
                    <Button paddingless
                        onClick={() => {
                            setDataUrl('');
                            setPreview('');
                        }}
                        className="px-4 py-2 bg-gray-100/20 transition rounded-lg hover:bg-gray-200/20"
                    >
                        RESET
                    </Button>
                    {dataUrl && (
                        <div className='flex gap-2'>
                            <Button paddingless
                                onClick={() => {
                                    textAreaRef.current?.select();
                                    document.execCommand('copy');
                                }}
                                className="px-4 py-2 bg-emerald-100/40 transition rounded-lg hover:bg-emerald-200/40"
                            >
                                <Icon pua="e8c8" />
                                <span> Copy Base64</span>
                            </Button>
                            <Button paddingless
                                onClick={() => {
                                    let rs = `![img](${textAreaRef.current?.value})`;
                                    window.navigator.clipboard.writeText(rs);
                                }}
                                className="px-4 py-2 bg-blue-100/60 transition rounded-lg hover:bg-blue-200/60"
                            >
                                <Icon pua="e70b" />
                                <span> B64 for MD</span>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Paper>
    );
}