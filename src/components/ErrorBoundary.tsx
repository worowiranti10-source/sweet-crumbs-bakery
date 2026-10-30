import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by Sweet Crumbs ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center p-6 text-[#2C1810]">
          <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-sm border border-[#E8DFD5] text-center">
            <div className="w-14 h-14 bg-red-50 text-[#B93838] rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold font-serif mb-2 text-[#2C1810]">Terjadi Sedikit Kendala</h2>
            <p className="text-sm text-[#705346] mb-6 leading-relaxed">
              Halaman ini mengalami kendala teknis sementara. Data Anda tetap aman. Silakan muat ulang halaman atau kembali ke beranda.
            </p>
            {this.state.error && (
              <div className="bg-[#FAF6F0] p-3 rounded-lg text-xs font-mono text-stone-700 text-left mb-6 overflow-x-auto border border-[#E8DFD5]">
                {this.state.error.message}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2C1810] text-white rounded-xl text-sm font-medium hover:bg-[#3D2318] transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> Muat Ulang Halaman
              </button>
              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#FAF6F0] text-[#2C1810] border border-[#E8DFD5] rounded-xl text-sm font-medium hover:bg-[#F3ECE1] transition-colors"
              >
                <Home className="w-4 h-4" /> Kembali ke Beranda
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
