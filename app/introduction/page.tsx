'use client';

import React from 'react';
import {

    useTheme,

} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import GroupsIcon from '@mui/icons-material/Groups';

import { BotMessageSquare } from 'lucide-react';
import Tabs from '../../components/Tabs';



const guideData = [
    {
        label: 'Home',
        icon: <HomeIcon className="text-[24px] text-stone-500" />,
        gif: '/home-guide.gif',
        description: 'Quickly view dashboard, main features, and access other pages from the navigation bar.',
        steps: [
            { label: 'Check & edit content' },
            { label: 'Customize and upload logo' },
            { label: 'Share & review' },
            { label: 'Generate PDF' },
            { label: 'Employees sign' },
        ],
    },
    {
        label: 'Bookmark',
        icon: <BookmarkIcon className="text-[24px] text-stone-500" />,
        gif: '/bookmark-guide.gif',
        description: 'Add, manage, and search your bookmarks for quick access to important items.',
        steps: [
            { label: 'Add bookmark' },
            { label: 'Organize folders' },
            { label: 'Quick search' },
            { label: 'Remove bookmark' },
        ],
    },
    {
        label: 'Design',
        icon: <DesignServicesIcon className="text-[24px] text-stone-500" />,
        gif: '/design-guide.gif',
        description: 'Start a new design, use the toolbar to customize, and save/export your work easily.',
        steps: [
            { label: 'Start new design' },
            { label: 'Customize' },
            { label: 'Preview' },
            { label: 'Export' },
        ],
    },
    {
        label: 'Partner',
        icon: <GroupsIcon className="text-[24px] text-stone-500" />,
        gif: '/partner-guide.gif',
        description: 'View, invite, and manage your business partners and track their activities.',
        steps: [
            { label: 'View partners' },
            { label: 'Invite partner' },
            { label: 'Track activities' },
        ],
    },
    {
        label: 'Chatbot',
        icon: <BotMessageSquare className="text-[24px] text-stone-500" />,
        gif: '/chatbot-guide.gif',
        description: 'Chat with our AI assistant to get answers to your questions and get help with your tasks.',
        steps: [
            { label: 'Chat with AI' },
        ],
    }
];

const InstructionsPage = () => {
    const theme = useTheme();
    const handbookTabs = guideData.map(item => item.label);
    const [activeTab, setActiveTab] = React.useState(guideData[0].label);
    const selectedIdx = guideData.findIndex(item => item.label === activeTab);
    const currentStep = 0;

    return (
        <div className="min-h-screen bg-gray-50 w-full mt-4 flex flex-col">
            {/* Tabs trên cùng */}
            <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-4">
                <div className="bg-white rounded-2xl shadow-sm flex flex-col gap-4 p-4">
                    <Tabs
                        tabs={handbookTabs}
                        activeTab={activeTab}
                        onTabClick={setActiveTab}
                    />
                    <div className="flex justify-between w-full gap-2 p-2">
                        {/* Sidebar Progress */}
                        <div className="w-[400px] bg-stone-100 rounded-2xl p-8 flex flex-col gap-2">
                            <div className="font-bold text-stone-900 text-xl">Progress</div>
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
                        {/* Nội dung hướng dẫn */}
                        <div className="flex flex-col gap-2 rounded-lg w-full p-5">
                            {guideData[selectedIdx].gif && (
                                <img
                                    src={guideData[selectedIdx].gif}
                                    alt={guideData[selectedIdx].label + ' guide'}
                                    className="max-w-[420px] max-h-[320px] rounded-xl shadow bg-stone-100 object-contain"
                                    onError={e => (e.currentTarget.style.display = 'none')}
                                />
                            )}
                            <h2 className="text-2xl font-bold text-stone-900 text-left">
                                {guideData[selectedIdx].label} Guide
                            </h2>
                            <p className="text-base text-stone-500 max-w-2xl text-left">
                                {guideData[selectedIdx].description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructionsPage; 