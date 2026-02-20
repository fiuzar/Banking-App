'use client'

import {
	ArrowLeft,
	Bell,
	Trash2
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { get_notification_list, mark_notification_read, clear_notification_history } from "@/server-functions/notifications"
import { formatRelativeTime } from "@/lib/time"
import { useLanguage } from "@/messages/LanguageProvider"

export default function NotificationsPage() {
	const { t } = useLanguage()
	const [notifications, setNotifications] = useState([])
	const [loading, setLoading] = useState(true)
	const [showModal, setShowModal] = useState(false)

	// Fetch notifications on mount
	useEffect(() => {
		async function loadData() {
			const { notifications } = await get_notification_list()
			setNotifications(notifications)
			setLoading(false)
		}
		loadData()
	}, [])

	// Clear history modal
	const handleClearHistory = () => setShowModal(true)
	const cancelClearHistory = () => setShowModal(false)
	const confirmClearHistory = async () => {
		const res = await clear_notification_history()
		if (res.success) setNotifications([])
		setShowModal(false)
	}

	// Mark all read
	const handleMarkAllRead = async () => {
		const res = await mark_notification_read()
		if (res.success) {
			setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
		}
	}

	// Auto-mark read when page opens
	useEffect(() => {
		if (notifications.some(n => !n.is_read)) {
			mark_notification_read()
		}
	}, [notifications])

	if (loading) return (
		<div className="p-20 text-center font-bold text-n-400">
			{t("Alerts", "header.loading")}
		</div>
	)

	return (
		<div className="min-h-screen bg-white">
			{/* Clear history modal */}
			{showModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
					<div className="bg-white rounded-2xl shadow-lg p-6 max-w-xs w-full">
						<h2 className="font-bold text-lg mb-2">{t("Alerts", "clearModal.title")}</h2>
						<p className="text-sm text-n-500 mb-6">{t("Alerts", "clearModal.description")}</p>
						<div className="flex gap-2 justify-end">
							<Button variant="ghost" onClick={cancelClearHistory}>
								{t("Alerts", "clearModal.cancel")}
							</Button>
							<Button variant="destructive" onClick={confirmClearHistory}>
								{t("Alerts", "clearModal.confirm")}
							</Button>
						</div>
					</div>
				</div>
			)}

			{/* Header */}
			<div className="p-6 flex items-center justify-between border-b border-slate-100">
				<div className="flex items-center gap-4">
					<Link href="/app"><ArrowLeft size={24} className="text-brand-dark" /></Link>
					<h1 className="text-xl font-black text-brand-dark">{t("Alerts", "header.title")}</h1>
				</div>
				<button onClick={handleMarkAllRead} className="text-[10px] font-bold text-primary uppercase tracking-widest hover:opacity-70">
					{t("Alerts", "header.markRead")}
				</button>
			</div>

			{/* Notification list */}
			<div className="max-w-md mx-auto p-4 space-y-2 mb-24">
				{notifications.length > 0 ? (
					notifications.map(n => (
						<div
							key={n.id}
							className={`p-4 rounded-3xl transition-all flex gap-4 ${n.is_read ? 'bg-white opacity-60' : 'bg-secondary border border-primary/10 shadow-sm'}`}
						>
							<div className="flex-1 space-y-1">
								<div className="flex justify-between items-start">
									<p className="text-sm font-bold text-brand-dark leading-tight">{n.title}</p>
									<span className="text-[10px] font-medium text-n-400">
										{n.created_at ? formatRelativeTime(n.created_at) : 'now'}
									</span>
								</div>
								<p className="text-xs text-n-500 leading-relaxed">{n.message}</p>
							</div>
							{!n.is_read && <div className="w-2 h-2 bg-primary rounded-full mt-2" />}
						</div>
					))
				) : (
					<div className="py-20 text-center">
						<Bell className="text-n-200 mx-auto" size={32} />
						<p className="font-bold mt-4">{t("Alerts", "empty.title")}</p>
						<p className="text-xs text-n-400">{t("Alerts", "empty.subtitle")}</p>
					</div>
				)}
			</div>

			{/* Clear history button */}
			<div className="fixed bottom-24 left-0 right-0 px-6 max-w-md mx-auto md:bottom-8">
				<Button
					onClick={handleClearHistory}
					variant="outline"
					className="w-full h-12 rounded-2xl flex gap-2 text-n-500 font-bold hover:text-red-500"
				>
					<Trash2 size={18} /> {t("Alerts", "actions.clearHistory")}
				</Button>
			</div>
		</div>
	)
}
