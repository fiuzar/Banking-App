'use client'

import {
	ArrowLeft,
	Bell,
	Check,
	Trash2,
	ArrowDownLeft,
	ArrowUpRight,
	ShieldAlert,
	Zap
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { get_notification_list, mark_notification_read, clear_notification_history } from "@/server-functions/notifications"

export default function NotificationsPage() {
	const [notifications, setNotifications] = useState([])
	const [loading, setLoading] = useState(true)
	const [showModal, setShowModal] = useState(false)

	// 1. Fetch data on load
	useEffect(() => {
		async function loadData() {
			const { notifications } = await get_notification_list()
			setNotifications(notifications)
			setLoading(false)
		}
		loadData()
	}, [])

	const handleClearHistory = async () => {
		setShowModal(true)
	}

	const confirmClearHistory = async () => {
		const res = await clear_notification_history()
		if (res.success) setNotifications([])
		setShowModal(false)
	}

	const cancelClearHistory = () => {
		setShowModal(false)
	}

	async function handleMarkAllRead(){
		const res = await mark_notification_read()
		if(res.success){
		}
	}

	// const [notifications, setNotifications] = useState([
	//   {
	//     id: 1,
	//     title: "Money Received",
	//     desc: "Your USD Savings was credited with $4,500.00 from Stripe.",
	//     time: "2m ago",
	//     type: "credit",
	//     isRead: false
	//   },
	//   {
	//     id: 2,
	//     title: "New Login Detected",
	//     desc: "A new login was detected from a Chrome browser on MacOS.",
	//     time: "1h ago",
	//     type: "security",
	//     isRead: false
	//   },
	//   {
	//     id: 3,
	//     title: "Bill Payment Successful",
	//     desc: "Your Electricity bill of $120.50 has been settled.",
	//     time: "5h ago",
	//     type: "debit",
	//     isRead: true
	//   }
	// ])

	// const markAllRead = () => {
	//   setNotifications(notifications.map(n => ({ ...n, isRead: true })))
	// }

	useEffect(() => {
		// When the user opens this page, mark all as read automatically
		const clearBadge = async () => {
			await mark_notification_read(); // Server Action
			// setUnreadCount(0); // Update Context locally for instant UI response
			// ^^^ Commented out because setUnreadCount is not defined in this file.
		};

		if (notifications.some(n => !n.is_read)) {
			clearBadge();
		}
	}, [notifications]);

	if (loading) return <div className="p-20 text-center font-bold text-n-400">Loading alerts...</div>

	return (
		<div className="min-h-screen bg-white">
			{/* Modal for clear notification history */}
			{showModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
					<div className="bg-white rounded-2xl shadow-lg p-6 max-w-xs w-full">
						<h2 className="font-bold text-lg mb-2">Clear all alerts?</h2>
						<p className="text-sm text-n-500 mb-6">Are you sure you want to clear all alerts? This action cannot be undone.</p>
						<div className="flex gap-2 justify-end">
							<Button variant="ghost" onClick={cancelClearHistory}>Cancel</Button>
							<Button variant="destructive" onClick={confirmClearHistory}>Yes, clear</Button>
						</div>
					</div>
				</div>
			)}
			{/* Header */}
			<div className="p-6 flex items-center justify-between border-b border-slate-100">
				<div className="flex items-center gap-4">
					<Link href="/app"><ArrowLeft size={24} className="text-brand-dark" /></Link>
					<h1 className="text-xl font-black text-brand-dark">Alerts</h1>
				</div>
				<button onClick={handleMarkAllRead} className="text-[10px] font-bold text-primary uppercase tracking-widest hover:opacity-70">
					Mark all as read
				</button>
			</div>

			<div className="max-w-md mx-auto p-4 space-y-2 mb-24">
				{notifications.length > 0 ? (
					notifications.map((n) => (
						<div
							key={n.id}
							className={`p-4 rounded-3xl transition-all flex gap-4 ${n.is_read ? 'bg-white opacity-60' : 'bg-secondary border border-primary/10 shadow-sm'}`}
						>
							{/* Logic for icons/colors based on n.type remains same as your code */}
							<div className="flex-1 space-y-1">
								<div className="flex justify-between items-start">
									<p className="text-sm font-bold text-brand-dark leading-tight">{n.title}</p>
									<span className="text-[10px] font-medium text-n-400">{n.time || 'now'}</span>
								</div>
								<p className="text-xs text-n-500 leading-relaxed">{n.message || n.desc}</p>
							</div>
							{!n.is_read && <div className="w-2 h-2 bg-primary rounded-full mt-2" />}
						</div>
					))
				) : (
					/* Empty State UI */
					<div className="py-20 text-center">
						<Bell className="text-n-200 mx-auto" size={32} />
						<p className="font-bold mt-4">No new alerts</p>
					</div>
				)}
			</div>

			<div className="fixed bottom-24 left-0 right-0 px-6 max-w-md mx-auto md:bottom-8">
				<Button onClick={handleClearHistory} variant="outline" className="w-full h-12 rounded-2xl flex gap-2 text-n-500 font-bold hover:text-red-500">
					<Trash2 size={18} /> Clear Notification History
				</Button>
			</div>
		</div>
	)
}