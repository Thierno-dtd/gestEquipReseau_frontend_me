import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { infrastructureAPI } from '@services/api';
import {
    ArrowLeft,
    Plus,
    MapPin,
    Layers,
    Server,
    Package,
    ChevronRight
} from 'lucide-react';
import Loading from '@components/shared/Common/Loading';
import Badge from '@components/shared/Common/Badge';
import { EquipmentStatus } from '@models/infrastructure';

const SiteDetailPage = () => {
    const { siteId } = useParams<{ siteId: string }>();
    const navigate = useNavigate();

    // Récupérer les détails du site
    const { data: siteData, isLoading: siteLoading } = useQuery({
        queryKey: ['site', siteId],
        queryFn: () => infrastructureAPI.getSiteById(siteId!),
        enabled: !!siteId,
    });

    // Récupérer les zones du site
    const { data: zonesData, isLoading: zonesLoading } = useQuery({
        queryKey: ['zones', siteId],
        queryFn: () => infrastructureAPI.getZones(siteId),
        enabled: !!siteId,
    });

    const isLoading = siteLoading || zonesLoading;
    const site = siteData?.data;
    const zones = zonesData?.data.Zone || [];

    if (isLoading) {
        return <Loading fullScreen text="Chargement du site..." />;
    }

    if (!site) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <p className="text-gray-600 dark:text-gray-400">Site non trouvé</p>
            </div>
        );
    }

    // Fonction pour obtenir la couleur du statut
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ONLINE':
                return 'bg-green-500';
            case 'OFFLINE':
                return 'bg-red-500';
            case 'WARNING':
                return 'bg-orange-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            {/* Top App Bar */}
            <div className="flex items-center bg-surface-light dark:bg-surface-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center justify-center w-12 h-12"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-800 dark:text-white" />
                </button>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex-1 text-center">
                    {site.name}
                </h2>
                <button className="flex items-center justify-center w-12 h-12 text-gray-800 dark:text-white">
                    <span className="text-2xl">⋮</span>
                </button>
            </div>

            {/* Body Content */}
            <div className="flex-grow p-4 space-y-6">
                {/* Site Information */}
                <div className="space-y-2">
                    <div className="flex items-start gap-2">
                        <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-base text-gray-800 dark:text-white">
                                {site.address}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {site.city}, {site.country}
                            </p>
                        </div>
                    </div>
                    {site.description && (
                        <p className="text-sm text-gray-500 dark:text-[#92b7c9] pt-1">
                            {site.description}
                        </p>
                    )}
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-4">
                    <div className="flex min-w-[120px] flex-1 flex-col gap-2 rounded-lg p-4 border border-gray-200 dark:border-[#325567] bg-white dark:bg-background-dark shadow-sm">
                        <div className="flex items-center gap-2">
                            <Layers className="w-5 h-5 text-blue-500" />
                            <p className="text-gray-600 dark:text-white text-base font-medium">
                                Zones
                            </p>
                        </div>
                        <p className="text-gray-900 dark:text-white text-2xl font-bold">
                            {site.zonesCount}
                        </p>
                    </div>

                    <div className="flex min-w-[120px] flex-1 flex-col gap-2 rounded-lg p-4 border border-gray-200 dark:border-[#325567] bg-white dark:bg-background-dark shadow-sm">
                        <div className="flex items-center gap-2">
                            <Server className="w-5 h-5 text-purple-500" />
                            <p className="text-gray-600 dark:text-white text-base font-medium">
                                Racks
                            </p>
                        </div>
                        <p className="text-gray-900 dark:text-white text-2xl font-bold">
                            {site.racksCount}
                        </p>
                    </div>

                    <div className="flex min-w-[120px] flex-1 flex-col gap-2 rounded-lg p-4 border border-gray-200 dark:border-[#325567] bg-white dark:bg-background-dark shadow-sm">
                        <div className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-green-500" />
                            <p className="text-gray-600 dark:text-white text-base font-medium">
                                Équipements
                            </p>
                        </div>
                        <p className="text-gray-900 dark:text-white text-2xl font-bold">
                            {site.equipmentsCount}
                        </p>
                    </div>
                </div>

                {/* Zones List */}
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white pb-3 pt-4">
                        Zones du Site
                    </h3>

                    {zones.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                            <Layers className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600 dark:text-gray-400">Aucune zone configurée</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {zones.map((zone) => (
                                <div
                                    key={zone.id}
                                    onClick={() => navigate(`/zones/${zone.id}`)}
                                    className="flex cursor-pointer items-center gap-4 rounded-lg bg-white dark:bg-gray-900/50 p-4 border border-gray-200 dark:border-[#325567] transition-all hover:bg-gray-50 dark:hover:bg-gray-800/60 shadow-sm"
                                >
                                    {/* Status Indicator */}
                                    <div className="flex h-6 w-6 items-center justify-center">
                                        <div className={`h-3 w-3 rounded-full ${getStatusColor(zone.status)}`} />
                                    </div>

                                    {/* Zone Info */}
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                            {zone.name}
                                        </h4>
                                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                            <span>{zone.type}</span>
                                            {zone.floor && (
                                                <>
                                                    <span>•</span>
                                                    <span>{zone.floor}</span>
                                                </>
                                            )}
                                            {zone.building && (
                                                <>
                                                    <span>•</span>
                                                    <span>{zone.building}</span>
                                                </>
                                            )}
                                        </div>
                                        {zone.description && (
                                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 line-clamp-1">
                                                {zone.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                                        <div className="text-center">
                                            <p className="font-bold text-gray-900 dark:text-white">
                                                {zone.racksCount}
                                            </p>
                                            <p>Baies</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-bold text-gray-900 dark:text-white">
                                                {zone.equipmentsCount}
                                            </p>
                                            <p>Équip.</p>
                                        </div>
                                    </div>

                                    {/* Chevron */}
                                    <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Action Button */}
            <button
                onClick={() => {/* TODO: Ouvrir modal d'ajout de zone */}}
                className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
                <Plus className="w-8 h-8" />
            </button>
        </div>
    );
};

export default SiteDetailPage;