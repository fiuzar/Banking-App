"use client"

import { useState, useEffect, useContext } from "react"
import { Button } from "@/components/ui/button"
import { AccountDetailsContext } from "@/server-functions/contexts"
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Filter,
  Download,
  CreditCard,
  UserPlus
} from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { get_transaction_history_list } from "@/server-functions/transaction-history"
import { useParams } from "next/navigation"
import { useLanguage } from "@/messages/LanguageProvider"

export default function AccountDetails() {
  const { t } = useLanguage()
  const { data: session } = useSession()
  const user_id = session?.user?.id

  const { account_type } = useParams()
  const { accountDetails } = useContext(AccountDetailsContext)

  const [transactions_history, setTransactionHistory] = useState([])
  const [hasMore, setHasMore] = useState(false)
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(false)

  const isSavings = account_type === "savings"
  const LIMIT = 10

  useEffect(() => {
    if (!user_id) return
    setTransactionHistory([])
    setOffset(0)
    loadTransactions(0, true)
  }, [user_id, account_type])

  async function loadTransactions(currentOffset, isInitial = false) {
    if (!user_id) return

    setLoading(true)

    const { success, history, hasMore: moreAvailable } =
      await get_transaction_history_list(account_type, currentOffset)

    if (success) {
      setTransactionHistory(prev =>
        isInitial ? history : [...prev, ...history]
      )
      setHasMore(moreAvailable)
    }

    setLoading(false)
  }

  const handleShowMore = () => {
    const nextOffset = offset + LIMIT
    setOffset(nextOffset)
    loadTransactions(nextOffset)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <div className="bg-primary pt-8 pb-32 px-6 text-white relative">
        <div className="flex justify-between items-center mb-8">
          <Link href="/app">
            <ArrowLeft size={24} />
          </Link>

          <h1 className="text-sm font-bold uppercase tracking-widest opacity-80">
            {t("AccountDetails", "header.title")}
          </h1>

          <button className="p-2 bg-white/10 rounded-full">
            <Download size={20} />
          </button>
        </div>

        <div className="space-y-1 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">
            {isSavings
              ? t("AccountDetails", "header.savingsSub")
              : t("AccountDetails", "header.checkingSub")}
          </p>

          <h1 className="text-5xl font-black tracking-tighter">
            $
            {isSavings
              ? parseFloat(
                  accountDetails?.savings_balance || 0
                ).toLocaleString(undefined, { minimumFractionDigits: 2 })
              : parseFloat(
                  accountDetails?.checking_balance || 0
                ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h1>

          {/* ACCOUNT INFO */}
          <div className="mt-4 flex flex-col items-center gap-2">
            <div className="bg-white/10 hover:bg-white/20 transition-all px-4 py-2 rounded-2xl cursor-pointer flex items-center gap-3 border border-white/5 shadow-inner">
              <div className="flex flex-col items-start">
                <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white/40 leading-none">
                  {t("AccountDetails", "header.accNumberLabel")}
                </span>

                <span className="text-sm font-mono font-bold tracking-widest text-emerald-400">
                  {isSavings
                    ? accountDetails?.savings_account_number || "--- --- ----"
                    : accountDetails?.checking_account_number ||
                      "--- --- ----"}
                </span>

                <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white/40 leading-none">
                  {t("AccountDetails", "header.bankNameLabel")}
                </span>

                <span className="text-sm font-mono font-bold tracking-widest text-emerald-400">
                  {t("AccountDetails", "header.bankName")}
                </span>
              </div>

              <div className="h-6 w-[1px] bg-white/10" />
              <CreditCard size={14} className="text-white/40" />
            </div>
          </div>
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="max-w-md mx-auto px-6 -mt-12 relative z-20">
        <div className="bg-white rounded-3xl p-2 shadow-xl border border-slate-100 flex gap-2">
          <Link
            href={`/app/deposit/card?account=${account_type}`}
            className="flex-1"
          >
            <Button className="w-full h-14 bg-green-800 hover:bg-green-900 rounded-2xl flex flex-col items-center justify-center">
              <CreditCard size={18} />
              <span className="text-[10px] font-bold uppercase mt-1">
                {t("AccountDetails", "actions.deposit")}
              </span>
            </Button>
          </Link>

          <Link
            href={`/app/deposit/request?account=${account_type}`}
            className="flex-1"
          >
            <Button
              variant="outline"
              className="w-full h-14 border-slate-200 text-slate-700 rounded-2xl flex flex-col items-center justify-center"
            >
              <UserPlus size={18} />
              <span className="text-[10px] font-bold uppercase mt-1">
                {t("AccountDetails", "actions.request")}
              </span>
            </Button>
          </Link>
        </div>
      </div>

      {/* TRANSACTIONS */}
      <div className="bg-white mt-8 min-h-[60vh] p-6 rounded-t-[40px] shadow-2xl relative z-10">
        <div className="flex justify-between items-center mb-6 pt-2">
          <h2 className="text-lg font-black text-brand-dark">
            {t("AccountDetails", "transactions.title")}
          </h2>

          <div className="flex gap-2">
            <button className="p-2 bg-slate-50 rounded-full text-slate-400">
              <Search size={18} />
            </button>
            <button className="p-2 bg-slate-50 rounded-full text-slate-400">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {transactions_history.map(tx => (
            <TransactionRow key={tx.id} tx={tx} />
          ))}

          {!loading && transactions_history.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-sm">
              {t("AccountDetails", "transactions.empty")}
            </div>
          )}
        </div>

        {hasMore && (
          <Button
            onClick={handleShowMore}
            disabled={loading}
            variant="outline"
            className="w-full mt-8 h-12 rounded-2xl border-slate-200 text-green-800 font-bold"
          >
            {loading
              ? t("AccountDetails", "transactions.loading")
              : t("AccountDetails", "transactions.showMore")}
          </Button>
        )}
      </div>
    </div>
  )
}

function TransactionRow({ tx }) {
  const { t } = useLanguage()
  const isCredit = tx.direction === "credit"

  return (
    <Link href={`/app/transaction-details/${tx.id}`}>
      <div className="flex justify-between items-center group cursor-pointer">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              isCredit
                ? "bg-emerald-100 text-emerald-600"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {isCredit ? (
              <ArrowDownLeft size={20} />
            ) : (
              <ArrowUpRight size={20} />
            )}
          </div>

          <div>
            <p className="font-bold text-slate-900 group-hover:text-green-800 transition-colors">
              {tx.name}
            </p>

            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
              {tx.date} •{" "}
              {t(
                "AccountDetails",
                `transactions.types.${tx.direction}`
              )}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p
            className={`font-black ${
              isCredit ? "text-emerald-600" : "text-slate-900"
            }`}
          >
            {isCredit ? "+" : "-"}$
            {parseFloat(tx.amount).toLocaleString(undefined, {
              minimumFractionDigits: 2
            })}
          </p>

          <p className="text-[9px] text-slate-300 font-bold uppercase italic">
            {tx.status}
          </p>
        </div>
      </div>
    </Link>
  )
}
