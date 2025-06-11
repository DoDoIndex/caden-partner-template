'use client';

import React from 'react';
import {

    useTheme,

} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import GroupsIcon from '@mui/icons-material/Groups';

import { BotMessageSquare, Dot } from 'lucide-react';
import Tabs from '../../components/Tabs';



const guideData = [
    {
        label: 'Home',
        icon: <HomeIcon className="text-[24px] text-stone-500" />,
        gifs: [
            {
                src: '/Gif/Home Guide/Home-01.gif',
                caption: 'How to add tiles to bookmark'
            },
            {
                src: '/Gif/Home Guide/Home-02.gif',
                caption: 'How to look for tiles'
            }
        ],
        description: 'Learn how to explore tiles, save your favorites to bookmarks, and share them with others. Everything you need to get started.',
        steps: [
            { label: 'How to look for tiles' },
            { label: 'How to add tiles to bookmark' },
            { label: 'How to share tiles' },
        ],
    },
    {
        label: 'Bookmark',
        icon: <BookmarkIcon className="text-[24px] text-stone-500" />,
        gifs: [
            {
                src: '/Gif/Bookmark Guide/Bookmark-01.gif',
                caption: 'Create collection and customize price'
            },
            {
                src: '/Gif/Bookmark Guide/Bookmark-02.gif',
                caption: 'Export catalog'
            },
        ],
        description: 'Organize your favorite tiles by adding them to bookmarks, creating collections, customizing pricing and branding, and exporting your catalog with ease.',
        steps: [
            { label: 'Add tiles to bookmark' },
            { label: 'Create collection' },
            { label: 'Customize price and your brand' },
            { label: 'Export catalog' },
        ],
    },
    {
        label: 'Design',
        icon: <DesignServicesIcon className="text-[24px] text-stone-500" />,
        gifs: [
            {
                src: '/Gif/Design Guide/Design-01.gif',
                caption: 'Upload background and design image'
            },
            {
                src: '/Gif/Design Guide/Design-02.gif',
                caption: 'Choose background and design image'
            },
        ],
        description: 'Easily create your own tile layout - start by uploading or choosing a background, add tiles, process the design, and download the final result in seconds.',
        steps: [
            { label: 'Upload or choose background' },
            { label: 'Add tiles' },
            { label: 'Process image' },
            { label: 'Download result' },
        ],
    },
    {
        label: 'Partner',
        icon: <GroupsIcon className="text-[24px] text-stone-500" />,
        gifs: [
            {
                src: '/Gif/Partner Guide/Partner.gif',
                caption: 'Register as a partner'
            },
        ],
        description: 'Learn about our partner program and take the next step by registering to join our growing network.',
        steps: [
            { label: 'Read about our partner program' },
            { label: 'Register as a partner' }
        ],
    },
    {
        label: 'Chatbot',
        icon: <BotMessageSquare className="text-[24px] text-stone-500" />,
        gifs: [
            {
                src: '/Gif/Chatbot Guide/Chatbot-01.gif',
                caption: 'Add tiles to bookmark 1'
            },
            {
                src: '/Gif/Chatbot Guide/Chatbot-02.gif',
                caption: 'Add tiles to bookmark 2'
            },
            {
                src: '/Gif/Chatbot Guide/Chatbot-03.gif',
                caption: 'Create collection 1'
            },
            {
                src: '/Gif/Chatbot Guide/Chatbot-04.gif',
                caption: 'Create collection 2'
            },
            {
                src: '/Gif/Chatbot Guide/Chatbot-05.gif',
                caption: 'Chat with AI and find tiles'
            },
            {
                src: '/Gif/Chatbot Guide/Chatbot-06.gif',
                caption: 'Way to show collection'
            }
        ],
        description: 'Chat with AI to discover tiles, save them to bookmarks, and automatically create collections tailored to your needs.',
        steps: [
            { label: 'Chat with AI' },
            { label: 'Find tiles' },
            { label: 'Add to bookmark automatically' },
            { label: 'Create collection automatically' },
        ],
    }
];

const InstructionsPage = () => {
    const theme = useTheme();
    const HelpTabs = guideData.map(item => item.label);
    const [activeTab, setActiveTab] = React.useState(guideData[0].label);
    const selectedIdx = guideData.findIndex(item => item.label === activeTab);
    const currentStep = 0;

    return (
        <div className="min-h-screen bg-gray-50 w-full mt-4 flex flex-col">
            {/* Tabs trên cùng */}
            <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-4">
                <div className="bg-white rounded-2xl shadow-sm flex flex-col gap-4 p-4">
                    <div
                        className="overflow-x-auto whitespace-nowrap -mx-2 px-2"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        <Tabs
                            tabs={HelpTabs}
                            activeTab={activeTab}
                            onTabClick={setActiveTab}
                        />
                    </div>
                    <style jsx>{`
                        div::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>
                    <div className="flex flex-col md:flex-row w-full gap-2 p-2">
                        {/* Sidebar How to use */}
                        <div className="w-full md:w-[400px] bg-stone-100 rounded-2xl p-4 flex flex-col mb-4 md:mb-0">
                            <div className="sticky top-16 pt-4">
                                <div className="font-bold text-stone-900 text-xl mb-4">How to use</div>
                                <div className="flex flex-col gap-2">
                                    {guideData[selectedIdx]?.steps?.map((step, idx) => (
                                        <div key={step.label} className="flex items-center gap-4">
                                            <span className="w-9 h-9 flex items-center justify-center rounded-full bg-stone-500 text-white text-base font-semibold shrink-0">
                                                {idx + 1}
                                            </span>
                                            <span className="text-base text-stone-900 font-medium">{step.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* Nội dung hướng dẫn */}
                        <div className="flex flex-col gap-2 rounded-lg w-full p-2 md:p-5">
                            <h2 className="text-2xl font-bold text-stone-900 text-left">
                                {guideData[selectedIdx].label} Guide
                            </h2>
                            <p className="text-base text-stone-500 w-full text-left">
                                {guideData[selectedIdx].description}
                            </p>
                            {guideData[selectedIdx].gifs && guideData[selectedIdx].gifs.map((gif, idx) => (
                                <div key={gif.src} className="flex flex-col items-start my-3">
                                    <span className="flex items-center gap-1 mb-2 text-stone-700 text-base md:text-lg font-semibold"><Dot className="text-stone-500" />{gif.caption}:</span>
                                    <img
                                        src={gif.src}
                                        alt={guideData[selectedIdx].label + ' guide ' + (idx + 1)}
                                        className="rounded-xl shadow bg-stone-100 object-contain w-full max-w-xs md:max-w-[700px] lg:max-w-[900px]"
                                        onError={e => (e.currentTarget.style.display = 'none')}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructionsPage; 